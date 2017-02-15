var amqp = require('amqplib/callback_api');
const config = require('./../../config');
const logger = require('./../../applogger');
var MODULE = (function () {
	var my = {};
	my.moduleMethod = function () {
    function start() {
      amqp.connect(config.RABBITMQ.rabbitmqURL + '?heartbeat=60', function(err, conn) {
        if (err) {
          logger.error('[AMQP]', err.message);
          return setTimeout(start, 1000);
        }
        conn.on('error', function(err) {
          if (err.message !== 'Connection closing') {
            logger.error('[AMQP] conn error', err.message);
          }
        });
        conn.on('close', function() {
          logger.error('[AMQP] reconnecting');
          return setTimeout(start, 1000);
        });
        logger.debug('[AMQP] connected');
        amqpConn = conn;
        whenConnected();
				return null;
      });
    }

    function whenConnected() {
      startPublisher();
      startWorker();
    }
	};
	return my;
}());
module.exports.MODULE = MODULE;
