'use strict';
const ontologyMgrNeo4jController = require('./ontologyMgrNeo4jController');
const logger = require('./../../applogger');
const domainMongoController = require('../domains/domainMongoController');
const config = require('./../../config');
const graphConsts = require('./../common/graphConstants');
const async = require('async');

let getAllDomainDetails = function(domain) {
    logger.debug("Received request for retriving Objects",
        domain.name);
    //Save to Mongo DB
    //Save to Neo4j

    let promise = new Promise(function(resolve, reject) {
        async.waterfall([
                function(callback) {
                    ontologyMgrNeo4jController.getAllDomainDetailsCallback(
                        domain,
                        callback)
                }
            ],
            function(err, retrivedRelations) {
                if (err) {
                    reject(err);
                }
                resolve(retrivedRelations);
              });
  });
  return promise;
}

let getSubjectObjects = function(nodeObj) {
    logger.debug("Received request for retriving Objects",
        nodeObj.nodename);
    //Save to Mongo DB
    //Save to Neo4j

    let promise = new Promise(function(resolve, reject) {
        async.waterfall([
                function(callback) {
                    ontologyMgrNeo4jController.getSubjectObjectsCallback(
                        nodeObj,
                        callback)
                }
            ],
            function(err, retrivedRelations) {
                if (err) {
                    reject(err);
                }
                resolve(retrivedRelations);
              });
  });
  return promise;
}

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
                ontologyMgrNeo4jController.deleteObjectCallback(deleteObj, callback);
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


let publishEditedSubjectObjectAttributes = function(editTermRelation) {
    logger.debug("Received request for publishing Edited Intent term relation: " + editTermRelation.intentName);
    let promise = new Promise(function(resolve, reject) {
        logger.debug(editTermRelation.intentName);
        if (!editTermRelation.subjectName || !editTermRelation.objectName) {
            reject({
                error: 'Invalid Intent or term name..!'
            });
        }
        async.waterfall([
                function(callback) {
                    ontologyMgrNeo4jController.getPublishSubjectObjectAttributesCallback(editTermRelation, callback);
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

//orphaned nodes
let publishAllOrphanedNodes = function(subject) {
    logger.debug("Received request for retreiving orphans of :", subject.nodetype);
    let promise = new Promise(function(resolve, reject) {
        async.waterfall([
                function(callback) {
                    ontologyMgrNeo4jController.getAllOrphansCallback(subject, callback);
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


let modifySubjectProperties = function(subject){
  logger.debug("Editing Properties for ", subject.nodename);
  let promise = new Promise(function(resolve, reject){
        async.waterfall([function(callback) {
                    domainMongoController.checkDomainCallback(subject.domain,
                        callback);
                    },function(checkedDomain,callback){
                      ontologyMgrNeo4jController.modifySubjectPropertiesCallback(subject,callback)
                    },
                  ],
      function(err, modifiedProperties){
        if(err){
          reject(err)
        }
        resolve(modifiedProperties);
      });
  });
  return promise;
}



module.exports = {
    publishAddNode: publishAddNode,
    deleteObject: deleteObject,
    deleteOrphans: deleteOrphans,
    publishAllRelations: publishAllRelations,
    publishRelations: publishRelations,
    publishEditedSubjectObjectAttributes:publishEditedSubjectObjectAttributes,
    publishAllOrphanedNodes:publishAllOrphanedNodes,
    getAllDomainDetails: getAllDomainDetails,
    getSubjectObjects: getSubjectObjects,
    getSubjectObjects: getSubjectObjects,
    modifySubjectProperties: modifySubjectProperties
}
