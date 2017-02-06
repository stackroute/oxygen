'use strict';
const ontologyMgrNeo4jController = require('./ontologyMgrNeo4jController');
const logger = require('./../../applogger');
const async = require('async');

let publishAddNode = function(subject, object) {
    let promise = new Promise(function(resolve, reject) {
        if (!subject.nodeName || subject.nodeName.length <= 3) {
            reject({
                error: 'Invalid subject/object name..!'
            });
        } else {
            async.waterfall([
                    function(callback) {
                        ontologyMgrNeo4jController.getPublishAddNodeCallback(subject, object, callback);
                    }
                ],
                function(err, nodename) {
                    if (err) {
                        reject(err);
                    }
                    resolve(nodename);
                }); //End of waterfall
        }
    }); //End of Promise
    return promise;
}

let deleteObject = function(deleteObj) {
    logger.debug('ontologyMgrController', deleteObj);
    logger.debug('Received request for deleting an Object', deleteObj.objNodeName);

    let promise = new Promise(function(resolve, reject) {
        async.waterfall([function(callback) {
                logger.debug("inside waterfall:neo4jdelete", deleteObj);
                ontologyMgrNeo4jCtrl.deleteObjectCallback(deleteObj, callback);
            }],
            function(err, result) {
                if (err) {
                    reject(err);
                }
                resolve(result);

            }); //end of async.waterfall
    });
    return promise;
};

let deleteOrphans = function(deleteObj) {
    logger.debug("Received request for deleting the nodes who doesn't left with any relation " + deleteObj.nodename);
    let promise = new Promise(function(resolve, reject) {
        async.waterfall([function(callback) {
                ontologyMgrNeo4jCtrl.deleteOrphansCallback(deleteObj, callback);
            }],
            function(err, result) {
                if (err) {
                    reject(err);
                }
                resolve(result);

            }); //end of async.waterfall
    });
    return promise;
};

let publishRelations = function(subject) {
    logger.debug("Received request for retreiving :", subject.nodetype, " and :", subject.nodetype1);
    let promise = new Promise(function(resolve, reject) {
        async.waterfall([
                function(callback) {
                    ontologyMgrNeo4jController.getRelationsCallback(subject, callback)
                }
            ],
            function(err, retrievedObjects) {
                if (err) {
                    reject(err);
                }
                resolve(retrievedObjects);
            });
    });
    return promise;
};

let publishAllRelations = function(subject) {
    logger.debug("Received request for retreiving :", subject.nodetype, " and :", subject.nodetype1);
    let promise = new Promise(function(resolve, reject) {
        async.waterfall([
                function(callback) {
                    ontologyMgrNeo4jController.getAllRelationsCallback(subject, callback);
                }
            ],
            function(err, retrievedObjects) {
                if (err) {
                    reject(err);
                }
                resolve(retrievedObjects);
            });
    });
    return promise;
};

module.exports = {
    publishAddNode: publishAddNode,
    deleteObject: deleteObject,
    deleteOrphans: deleteOrphans,
    publishAllRelations: publishAllRelations,
    publishRelations: publishRelations
}
