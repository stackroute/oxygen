const highland = require('highland');
const amqp = require('amqplib');
const startIntentParser = require('./docOpenIntentParserEngine').startIntentParser;
const crawlerModules = require('./crawlerModules');
const logger = require('./../../applogger');
const config = require('./../../config');
const datapublisher = require('../serviceLogger/redisLogger');

const startCrawler = function() {
  
  highland(function(push, next) {
    let amqpConn = amqp.connect(config.RABBITMQ.rabbitmqURL);
    amqpConn
      .then(function(conn) {
        logger.info('[*] Connected to AMQP successfully..!');
        return conn.createChannel();
      })
      .then(function(chConn) {
        logger.info('[*] Established AMQP Channel connection successfully..!');

        //@TODO take the crawler MQ name from Config
        //making durable as false, so that .....
        chConn.assertQueue(config.OXYGEN.CRAWLER_MQ_NAME, { durable: false })
          .then(function(ok) {
            logger.debug("What is ok: ", ok);
            logger.debug('[*] Waiting for messages on ['+config.OXYGEN.CRAWLER_MQ_NAME+'], Reciever to exit press CTRL+C ');

            chConn.consume(config.OXYGEN.CRAWLER_MQ_NAME, function(msg) {
              logger.debug('[*] GOT [', msg.fields.routingKey, ']  [', msg.fields.consumerTag, ']');
              
              console.log(msg.content.toString());
              const dataObj = {
                data: msg.content.toString()
              };

              logger.debug('Message picked at crawler..!');

              push(null, dataObj);
              next();
            }, { 
              noAck: true 
            });             
          }); //end of assertQueue
      }); //end of channelConnection
  })
  .map(function(pipeDataObj) {
    let text,
        dataObj = JSON.parse(pipeDataObj.data);
    let promise = crawlerModules.getResponseToLowerCase(dataObj);
    logger.debug("getResponseToLowerCase message in pipe: ", dataObj);
    return promise;
  })
  .flatMap(promise => highland(
    promise
      .then(function(result) {
            logger.debug("Got message in pipe: ", result);
              return result;
          },
          function(err) {
            return err;
          })
  ))
  .map(function(dataToFindTerms) {
    let promise = crawlerModules.termsFinder(dataToFindTerms);
    return promise;
  })
  .flatMap(promise => highland(
    promise
      .then(function(result) {
              return result;
          },
          function(err) {
            return err;
          })
  ))
  .map(function(dataToProcess) {
    let processedInfo = crawlerModules.extractData(dataToProcess);
    // logger.debug('processedInfo: ', processedInfo);
    return processedInfo;
  })
  .flatMap(promise => highland(
    promise
      .then(function(result) {
        // logger.debug('extract Result: ', result);
          return result;
        },
        function(err) {
          return err;
        })
  ))
  .map(function(dataToIndexURL) {
    let promise = crawlerModules.indexUrl(dataToIndexURL);
    return promise;
  })
  .flatMap(promise => highland(
    promise
      .then(function(result) {
          return result;
        },
        function(err) {
          return err;
        })
  ))
  .map(function(webDocument) {
    let promise = crawlerModules.saveWebDocument(webDocument);
    return promise;
  })
  .flatMap(promise => highland(
    promise
      .then(function(result) {
          return result;
        },
        function(err) {
          return err;
        })
  ))
  .map(function(webDocument) {
    let promise = crawlerModules.getIntents(webDocument);
    return promise;
  })
  .flatMap(promise => highland(
    promise
      .then(function(result) {
          return result;
        },
        function(err) {
          return err;
        })
  ))
  .each(function(dataObj) {
    logger.debug("Consuming the data: ", dataObj);
    let redisCrawl={       
      domain: dataObj.domain,        
      actor: 'crawler',        
      message: dataObj.url,        
      status: 'crawling completed for the url'        
    }        
    datapublisher.processFinished(redisCrawl);        

    logger.debug('At consupmtion Intent : ', dataObj);
    let intents = dataObj.intents;
    delete dataObj.intents;

    logger.debug(intents);
    intents.forEach(function(intent) {
      logger.debug(' at each intent to send as msg ', intent);
      let obj = JSON.parse(JSON.stringify(dataObj.data));
      obj.intent = intent;
      logger.debug('printing the msg to send to parser');
      logger.debug(obj);

      let redisIntent={        
        domain: obj.domain,        
        actor: 'intent parser',        
        message: obj.intent,        
        status: 'intent parsing started for the particular intent'        
      }        
      datapublisher.processStart(redisIntent);
      startIntentParser(obj);
    });
  });
}

module.exports = {
  startCrawler: startCrawler
};