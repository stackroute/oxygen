'use strict';
const logger = require('./../../applogger');
const crawlerModules = require('./crawlerModules');

let crawlDocument = function (domain) {
    logger.debug("Received request for retriving domain details ", domain);
    let promise = new Promise(function (resolve, reject) {
        async.waterfall([
                function (callback) {
                    logger.debug("inside the waterfall of crawling document " + domain)
                    crawlerModules.extractData(domain, callback);
                }
            ],
            function (err, relativeWeights) {
                if (err) {
                    reject(err);
                }
                resolve(relativeWeights);
            });
    });
    return promise;
}

module.exports = {
    crawlDocument: crawlDocument
}
