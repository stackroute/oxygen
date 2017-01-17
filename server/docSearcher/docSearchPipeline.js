const logger = require('./../../applogger');
const config = require('./../../config');
const amqp = require('amqplib');
const highland = require('highland');
const controller = require('./docSearchController');
const checkRecentlySearched = require('./docSearchController').checkRecentlySearched;
const fetchPrevSearchResult = require('./docSearchController').fetchPrevSearchResult;

const startSearcher = function() {
    let amqpConn = amqp.connect(config.RABBITMQ.rabbitmqURL);

    amqpConn
        .then(function(conn) {
            logger.info('[*] Connected to AMQP successfully..!');
            return conn.createChannel();
        })
        .then(function(chConn) {
            logger.info('[*] Established AMQP Channel connection successfully..!');
            //making durable as false, so that .....
            chConn.assertQueue(config.OXYGEN.SEARCHER_MQ_NAME, { durable: false })
                .then(function(ok) {
                    logger.debug('[*] Waiting for messages on [' + config.OXYGEN.SEARCHER_MQ_NAME +
                        '], to exit press CTRL+C ');

                    highland(function(push, next) {

                            chConn.consume(config.OXYGEN.SEARCHER_MQ_NAME, function(msg) {

                                //convert from buffer to a JSON object
                                msg = JSON.parse(msg.content.toString());

                                logger.debug("[*] Got message ", msg);

                                push(null, msg)
                                next();
                            }, { noAck: true });
                        })
                        .map(function(msg) {
                            logger.info("Entered in checkRecentlySearched function for ", msg);

                            let promise = controller.checkRecentlySearched(msg)
                                // let promise = controller.checkRecentlySearched(domain, concept, start, nbrOfResult);

                            return promise;
                        })
                        .flatMap(promise => highland(
                            promise
                            .then(function(result) {
                                if (result.isRecent) {
                                    logger.info("Fetching the previously stored data");
                                    let storedres = controller.fetchPrevSearchResult(result.id)
                                    return storedres;
                                } else {
                                    let google_res = controller.storeURL(result.msg)
                                    logger.info("Check on google with the given domain and concepts");
                                    return google_res;
                                }
                            }, function(err) {
                                return err;
                            })
                        ))
                        .flatMap(promise => highland(
                            promise
                            .then(function(result) {
                                return result
                            }, function(err) {
                                return err;
                            })
                        ))
                        .each(function(result) {
                            logger.info('Highland function ends')
                        })
                })
        })
}

module.exports = {
    startSearcher: startSearcher
};
