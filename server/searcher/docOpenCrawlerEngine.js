const logger = require('./../../applogger');
const amqp = require('amqplib');
const config = require('./../../config');
// require('events').EventEmitter.defaultMaxListeners = Infinity;
const startCrawler = function(urlDataObj) {

  logger.debug("creating a connection with external source : ");
  let amqpConn = amqp.connect(config.RABBITMQ.rabbitmqURL);


  amqpConn
  .then(function(conn) {
   logger.info('[*] Connected to AMQP successfully..!');
   return conn.createChannel();
 })
  .then(function(chConn) {
   logger.info('[*] Established AMQP Channel connection successfully..!');

     //making durable as false, so that .....
     chConn.assertQueue(config.OXYGEN.CRAWLER_MQ_NAME, { durable: false })
     .then(function(ok) {
       logger.debug("What is ok: ", ok);
       logger.debug('[*] Waiting for messages on [' + 
        config.OXYGEN.CRAWLER_MQ_NAME +
        '], to exit press CTRL+C ');
       chConn.sendToQueue(config.OXYGEN.CRAWLER_MQ_NAME,new Buffer(JSON.stringify(urlDataObj) ));
       logger.debug("msg sent to crawler .. ..  ..");
       }); //end of assertQueue
   }); //end of channelConnection
}

module.exports = {
 startCrawler: startCrawler
};
