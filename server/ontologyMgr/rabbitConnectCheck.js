var amqp = require('amqplib/callback_api');
const config = require('./../../config');
const logger = require('./../../applogger');
var MODULE = require('./rabbitConnect.js');
var SODULE = (function(my) {
    my.moduleMethod = function() {
        amqp.connect(config.RABBITMQ.rabbitmqURL, function(err, conn) {
                if (err) {
                    logger.error('[AMQP]', err.message);
                    return setTimeout(moduleMethod, 1000);
                }
                conn.on('error', function(err) {
                    if (err.message !== 'Connection closing') {
                        logger.error('[AMQP] conn error', err.message);
                    }
                });
                conn.on('close', function() {
                    logger.error('[AMQP] reconnecting after 20 seconds');
                    return setTimeout(moduleMethod, 20000);
                });
                conn.createChannel(function(err, ch) {
                        var q = 'hello';
                        var msg = 'Hello World!';
                        ch.assertQueue(q, {
                            durable: false
                        });
                        // Note: on Node 6 Buffer.from(msg) should be used
                        ch.sendToQueue(q, new Buffer(msg));
                        logger.debug('[x] Sent %s', msg);
                        ch.on('error', function(err) {
                            logger.error('[AMQP] channel error', err.message);
                        });
                        ch.on('close', function() {
                            logger.log('[AMQP] channel closed');
                        });
                    });
                    return null;
                });
};
my.moduleMethod();
return my;
}(MODULE.MODULE));
