'use strict';
const subjectObjectNeo4jController = require('./subjectObjectNeo4jController');
const logger = require('./../../applogger');
const async = require('async');

let getObjects = function(nodeObj) {
    logger.debug("Received request for retriving Objects",
        nodeObj.nodeType);
    //Save to Mongo DB
    //Save to Neo4j

    let promise = new Promise(function(resolve, reject) {
        async.waterfall([
                function(callback) {
                    subjectObjectNeo4jController.getObjectsCallback(
                        nodeObj,
                        callback)
                }
            ],
            function(err, retrivedRelationsAndIntents) {
                if (err) {
                    reject(err);
                }
                resolve(retrivedRelationsAndIntents);
            }); //end of async.waterfall
    });
    return promise;
}

module.exports = {
  getObjects: getObjects,
}
