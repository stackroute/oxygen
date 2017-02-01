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
              });
  });
  return promise;
}


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
    getObjects: getObjects,
    publishNewAddItem: publishNewAddItem
}
