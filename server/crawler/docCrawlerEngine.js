const logger = require('./../../applogger');
const urlIndexing=require('./docCrawlerEngineController').urlIndexing;
const config = require('./../../config');

// const amqp = require('amqplib/callback_api');
const amqp = require('amqplib');
const highland = require('highland');

// require('events').EventEmitter.defaultMaxListeners = Infinity;
const startCrawler = function() {
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
       logger.debug('[*] Waiting for messages on ['
        + config.OXYGEN.CRAWLER_MQ_NAME + '], Reciever to exit press CTRL+C ');

       highland(function(push, next) {
         chConn.consume(config.OXYGEN.CRAWLER_MQ_NAME, function(msg) {
          console.log(msg.content.toString());
          logger.debug('[*] GOT [', msg.fields.routingKey, ']  [', msg.fields.consumerTag, ']');

          const dataObj = {
           data: msg.content.toString()
         };

         push(null, dataObj);
         next();

         logger.debug('Message picked at crawler..!');
       }, { noAck: true });
       })
       .map(function(dataObj) {
         logger.debug("Got message in pipe: ", dataObj);
         return dataObj;
       })
       .each(function(dataObj) {
         logger.debug("Consuming the data: ", dataObj);
         urlIndexing(dataObj.data);
       });
       }); //end of assertQueue
   }); //end of channelConnection
}

module.exports = {
  startCrawler: startCrawler
};
