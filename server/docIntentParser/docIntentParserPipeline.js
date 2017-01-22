const config = require('./../../config');
const logger = require('./../../applogger');
const parserController = require('./docParserController');
const datapublisher = require('../serviceLogger/redisLogger');
const amqp = require('amqplib');
const highland = require('highland');

const startIntentParser = function() {
  highland(function(push, next) {
    let amqpConn = amqp.connect(config.RABBITMQ.rabbitmqURL);
    amqpConn
    .then(function(conn) {
      logger.info('[*] Connected to AMQP successfully..!');
      return conn.createChannel();
    })
    .then(function(chConn) {
      logger.info('[*] Established AMQP Channel connection successfully..!');
      
      // making durable as false, so that .....
      chConn.assertQueue(config.OXYGEN.PARSER_MQ_NAME, { durable: false })
      .then(function(ok) {
        logger.debug("What is ok: ", ok);
        logger.debug('[*] Waiting for messages on [' + config.OXYGEN.PARSER_MQ_NAME + '], to exit press CTRL+C ');

        chConn.consume(config.OXYGEN.PARSER_MQ_NAME, function(msg) {
          logger.debug('[*] GOT [',msg.fields.routingKey, ']  [', msg.fields.consumerTag, ']');

          const dataObj = {
            data: msg.content.toString()
          };

          logger.debug('Message picked at searcher..!');

          push(null, dataObj);
          next();
        }, { 
          noAck: true 
        });
      });
    });
  })
  .map(function(dataObj) {
    logger.debug("Got message in pipe: ", dataObj);
    return dataObj.data;
  })
  .map(function(dataToProcess) {
    logger.debug("Consuming the data: ", dataToProcess);
    let promise = parserController.fetchIntentSpecificTerms(dataToProcess);
    return promise;
  })
  .flatMap(promise => highland(
    promise.then(function(result) {
        return result; 
      },
      function(err) {
        return err; 
      })
  ))
  .map(function(intentIntensityData) {
    logger.debug("inside findIntentIntensity");
    let processedInfo = parserController.findIntentIntensity(intentIntensityData)
    return processedInfo;
  })
  .map(function(conceptDocumentRelationshipData) {
    logger.debug("inside conceptDocumentRelationship");
    let promise = parserController.conceptDocumentRelationship(conceptDocumentRelationshipData);
    return promise;
  })
  .flatMap(promise => highland(
    promise.then(function(result) {
        return result;
      },
      function(err) {
        return err;
      })
  ))
  .each(function(result) {
    logger.debug("result : ", result.intensity);
    let redisIntent = {
      actor: 'intent parser',
      status: 'intent parsing completed for the particular intent'
    }
    datapublisher.processFinished(redisIntent);
    parserController.latestNoOfDocs(result.domain);
  });
} // end of startIntentParser

module.exports = {
  startIntentParser: startIntentParser
};
