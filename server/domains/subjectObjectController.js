'use strict';
// const domainNeo4jController = require('./domainNeo4jController');
// const termNeo4jController = require('./termNeo4jController');
// const intentNeo4jController = require('./intentNeo4jController');
const subjectObjectNeo4jController = require('./subjectObjectNeo4jController');
const domainMongoController = require('./domainMongoController');
const domainMgr = require('./domainManager');
const startCrawlerMQ = require('./../searcher/docOpenCrawlerEngine').startCrawler;
const logger = require('./../../applogger');

const async = require('async');


let publishNewAddItem = function(addItem) {
    logger.debug("Received request for publishing new subjectNode: " + addItem.subjectNode);
    let promise = new Promise(function(resolve, reject) {
        //logger.debug(addItem.intent);

        if (!addItem.subjectNode || !addItem.objectNode || addItem.subjectNode.length <= 3 || addItem.objectNode.length <= 3) {
            reject({
                error: 'Invalid subjectNode/objectNode name..!'
            });
        }
        async.waterfall([
                function(callback) {
                    subjectObjectNeo4jController.getPublishAddItemCallback(addItem, callback);
                }
            ],
            function(err, objectName) {
                if (err) {
                    reject(err);
                }
                resolve(objectName);
            }); //end of async.waterfall
    });
    return promise;
}

module.exports = {
    publishNewAddItem: publishNewAddItem
}
