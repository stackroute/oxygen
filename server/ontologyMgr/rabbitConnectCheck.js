var amqp = require('amqplib/callback_api');
const config = require('./../../config');
const logger = require('./../../applogger');
//var connection=require('./rabbitConnect');
let rab='';

amqp.connect(config.RABBITMQ.rabbitmqURL, function(err, conn) {

  conn.createChannel(function(err, ch) {
    if(err){
      console.log('asas');
    }else{
      rab =ch;
      var q = 'hello';
      var msg = 'Hello World!';

      rab.assertQueue(q, {durable: false});
      // Note: on Node 6 Buffer.from(msg) should be used
      rab.sendToQueue(q, new Buffer(msg));
      console.log(" [x] Sent %s", msg);
      //console.log(rab);
    }
  });
  //setTimeout(function() { conn.close(); process.exit(0) }, 500);
});

  //console.log(rab);

module.exports = rab;

// if the connection is closed or fails to be established at all, we will reconnect
//var ch=connection.connectRabbitMq;
// var ch=channel();
//     var q = 'hello';
//     var msg = 'Hello World!';
//
//     ch.assertQueue(q, {durable: false});
//     // Note: on Node 6 Buffer.from(msg) should be used
//     ch.sendToQueue(q, new Buffer(msg));
//     console.log(" [yogee] Sent %s", msg);
//
//   setTimeout(function() { conn.close(); process.exit(0) }, 500);
//
//   function channel() {
//     var c;
//     console.log("came hera 1");
//     amqp.connect('amqp://localhost', function(err, conn) {
//       conn.createChannel(function(err, ch) {
//         if(err){
//           logger.debug("Error is",err);
//         }
//         c=ch;
//         logger.debug("channel ",ch);
//         logger.debug("channel2 ",c);
//       });
// });
//       return c;
//   };
