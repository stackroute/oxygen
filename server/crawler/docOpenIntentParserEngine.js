const logger = require('./../../applogger');

//const amqp = require('amqplib/callback_api');
const amqp = require('amqplib');
const highland = require('highland');

// require('events').EventEmitter.defaultMaxListeners = Infinity;
const startIntentParser = function(urlDataObjId) {
 let amqpConn = amqp.connect('amqp://localhost');

 amqpConn
   .then(function(conn) {
     logger.info('[*] Connected to AMQP successfully..!');
     return conn.createChannel();
   })
   .then(function(chConn) {
     logger.info('[*] Established AMQP Channel connection successfully..!');

     //@TODO take the crawler MQ name from Config
     let crawlerMQName = 'intentParser';

    logger.debug("inside parser MQ sender "+ urlDataObjId.intent);
     //making durable as false, so that .....
     chConn.assertQueue(crawlerMQName, { durable: false })
       .then(function(ok) {
         logger.debug("What is ok: ", ok);
         logger.debug('[*] Waiting for messages on [' + crawlerMQName + '], to exit press CTRL+C ');
         chConn.sendToQueue(crawlerMQName,new Buffer(JSON.stringify(urlDataObjId)) );
         logger.debug("msg sent to intentParser .. ..  ..");
       }); //end of assertQueue
   }); //end of channelConnection
}

module.exports = {
 startIntentParser: startIntentParser
};
