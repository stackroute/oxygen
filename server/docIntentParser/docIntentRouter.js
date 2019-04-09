const logger = require('./../../applogger');
const Router = require('express').Router();
const amqp = require('amqplib');
const config = require('./../../config');

Router.post('/:domainName', function (req, res){
	let documentData = req.body;
	let domainName = req.params.domainName;

	let amqpConn = amqp.connect(config.RABBITMQ.rabbitmqURL);
   amqpConn
    .then(function(conn) {
      logger.info('[*] Connected to AMQP successfully..!');
      return conn.createChannel();
    })
    .then(function(chConn) {
      logger.info('[*] Established AMQP Channel connection successfully..!');

      logger.debug("inside parser MQ sender "+ documentData.intent);
      //making durable as false, so that .....
      chConn.assertQueue(config.OXYGEN.PARSER_MQ_NAME, { durable: false })
        .then(function(ok) {
          logger.debug("What is ok: ", ok);
          logger.debug('[*] Waiting for messages on ['+config.OXYGEN.PARSER_MQ_NAME +'], to exit press CTRL+C ');
          chConn.sendToQueue(config.OXYGEN.PARSER_MQ_NAME, new Buffer(JSON.stringify(documentData)));
          logger.debug("msg sent to intentParser ....");
        }); //end of assertQueue
    }); //end of channelConnection
return res.status(200).json({
        data: 'im workinggg'
    });
});

module.exports = Router;
