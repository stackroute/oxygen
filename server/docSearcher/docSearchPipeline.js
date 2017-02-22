const logger = require('./../../applogger');
const config = require('./../../config');
const amqp = require('amqplib');
const highland = require('highland');
const controller = require('./docSearchController');
const checkRecentlySearched = require('./docSearchController').checkRecentlySearched;
const fetchPrevSearchResult = require('./docSearchController').fetchPrevSearchResult;
const startCrawlerMQ = require('./docOpenCrawlerEngine').startCrawler;
const engineColln = require('./../common/engineColln');

let selector = 0;

const startSearcher = function() {

    highland(function(push, next){
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
                    chConn.consume(config.OXYGEN.SEARCHER_MQ_NAME, function(msg) {

                        //convert from buffer to a JSON object
                        msg = JSON.parse(msg.content.toString());

                        logger.debug("[*] Got message ", msg);

                        push(null, msg)
                        next();
                    },
                    {
                        noAck: true
                    });
                });
        });
    })
    .map(function(msg) {
        logger.debug("Entered in checkRecentlySearched function for ", msg);

        let promise = controller.checkInRecentlySearched(msg)
            // let promise = controller.checkRecentlySearched(domain, concept, start, nbrOfResult);
        return promise;
    })
    .flatMap(promise => highland(
        promise.then(
            function(result) {
                return result;
            }
            , function(err) {
                return err;
            })
    ))
    .map(function(recentSearchResult){
        if (recentSearchResult.isRecent) {
            logger.debug("Fetching the previously stored data");
            // return recentSearchResult.results;
            let prev_res = new Promise(function(resolve, reject) {
                resolve(recentSearchResult.results)
            })
            return prev_res
        } else {
            logger.debug("Making a Google search request and storing the data in Redis");
            if(selector > engineColln.KEYS.length-1) {
                selector = 0;
            }
            logger.debug("selector:", selector);
            return controller.getGoogleResults(recentSearchResult.msg, selector)
        }
    })
    .flatMap(promise => highland(
        promise.then(
            function(result) {
                return result;
            }
            , function(err) {
                return err;
            })
    ))
    // .error(function(err){
    //     logger.error("Error in search pipeline: ", err);
    // })
    .each(function(result) {
        logger.info('Highland function ends');
        selector += 1;
        result.forEach( function(res, i) {
            startCrawlerMQ(res);
        });

    })
}

module.exports = {
    startSearcher: startSearcher
};
