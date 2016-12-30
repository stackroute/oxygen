const logger = require('./../../applogger');
const amqp = require('amqplib');
const config = require('./../../config');
// require('events').EventEmitter.defaultMaxListeners = Infinity;
const startIntentParser = function(urlDataObjId) {
 let amqpConn = amqp.connect(config.RABBITMQ.rabbitmqURL);

 amqpConn
 .then(function(conn) {
   logger.info('[*] Connected to AMQP successfully..!');
   return conn.createChannel();
 })
 .then(function(chConn) {
   logger.info('[*] Established AMQP Channel connection successfully..!');

     //@TODO take the crawler MQ name from Config

     logger.debug("inside parser MQ sender "+ urlDataObjId.intent);
     //making durable as false, so that .....
     chConn.assertQueue(config.OXYGEN.PARSER_MQ_NAME, { durable: false })
     .then(function(ok) {
       logger.debug("What is ok: ", ok);
       logger.debug('[*] Waiting for messages on [' +
        config.OXYGEN.PARSER_MQ_NAME +
        '], to exit press CTRL+C ');
       chConn.sendToQueue(config.OXYGEN.PARSER_MQ_NAME,new Buffer(JSON.stringify(urlDataObjId)) );
       logger.debug("msg sent to intentParser .. ..  ..");
       }); //end of assertQueue
   }); //end of channelConnection
}

module.exports = {
 startIntentParser: startIntentParser
};
