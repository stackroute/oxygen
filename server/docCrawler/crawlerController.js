'use strict';
const fs = require('fs');
const async = require('async');
const request = require('request');
const cheerio = require('cheerio');
const keyword_extractor = require('keyword-extractor');
const logger = require('./../../applogger');
const crawlerModules = require('./crawlerModules');

let crawlDocument = function (domain) {
    logger.debug('crawlDocument: domain', domain);
    let promise = new Promise(function (resolve, reject) {
        async.waterfall([function (callback) {
                crawlerModules.getResponseToLowerCase(domain)
                    .then(function (success) {
                        callback(null, success);
                    }, function (err) {
                        callback(err, null);
                    });
            },
                function (resToLowerCase, callback) {
                    let extractedData = crawlerModules.extractData(resToLowerCase).then(function (success) {
                        callback(null, success);
                    }, function (err) {
                        callback(err, null);
                    });
                }
            ],
            function (err, result) {
                if (err) {
                    reject(err);
                }
                logger.info('relativeWeights: ', result);
                resolve(result);
            });
    });
    return promise;
};

module.exports = {
    crawlDocument: crawlDocument
};
