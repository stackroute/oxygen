const logger = require('./../../applogger');
const config = require('./../../config');
const amqp = require('amqplib');

// function sendToSearcherQueue(qURL, qName, qMsg, callback) {
//     logger.debug('Inside search queue');
//     logger.info('qURL: ', qURL);
//     amqp.connect(qURL).then(function(conn) {
//         logger.debug('Connected successfully...!')
//         return conn.createChannel().then(function(ch) {
//             let ok = ch.assertQueue(qName, { durable: false });

//             let qMsgBuffer = new Buffer('');
//             if(qMsg instanceof Object) {
//               qMsgBuffer = new Buffer(JSON.stringify(qMsg));
//             } else {
//               qMsgBuffer = new Buffer(qMsg);
//             }

//             return ok.then(function(_qok) {
//                 ch.sendToQueue(qName, qMsgBuffer);
//                 logger.info(" [x] Message Sent ", qMsg);
//                 return ch.close();
//             });
//         }).finally(function() { conn.close(); });
//     },
//     function(err){
//         logger.info('connection error: ', err);
//     }).catch(function(err){
//       logger.debug('error in connection: ', err);
//     });
// }
const sendToSearcherQueue = function(qURL, qName, qMsg, callback) {
 let amqpConn = amqp.connect(qURL);
logger.debug("inside queue")
 amqpConn
 .then(function(conn) {
   logger.info('[*] Connected to AMQP success..!');
   return conn.createChannel();
 })
 .then(function(chConn) {
   logger.info('[*] Established AMQP Channel connection successfully..!');
      let qMsgBuffer = new Buffer('');
            if(qMsg instanceof Object) {
              qMsgBuffer = new Buffer(JSON.stringify(qMsg));
            } else {
              qMsgBuffer = new Buffer(qMsg);
            }

     //@TODO take the crawler MQ name from Config
     //making durable as false, so that .....
     chConn.assertQueue(qName, { durable: false })
     .then(function(ok) {
       logger.debug("What is ok: ", ok);
       logger.debug('[*] Waiting for messages on [' +
        qName+
        '], to exit press CTRL+C ');
       chConn.sendToQueue(qName,qMsgBuffer);
       logger.debug("msg sent to searcher .. ..  ..");
       }); //end of assertQueue
   }); //end of channelConnection
}
module.exports = {
 sendToSearcherQueue : sendToSearcherQueue
};
