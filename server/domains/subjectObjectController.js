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

let publishEditedRelations = function(editRelationItem) {
    logger.debug("Received request for editing node relation: " + editRelationItem.subjectNode);
    let promise = new Promise(function(resolve, reject) {

        if (!editRelationItem.subjectNode || !editRelationItem.objectNode || editRelationItem.subjectNode.length <= 3 || editRelationItem.objectNode.length <= 3) {
            reject({
                error: 'Invalid subjectNode/objectNode name..!'
            });
        }
        async.waterfall([
                function(callback) {
                    subjectObjectNeo4jController.getPublishEditRelationItemCallback(editRelationItem, callback);
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

//Editing Intent term relation

let publishEditedIntentTermRelation = function(editTermRelation) {
    logger.debug("Received request for publishing Edited Intent term relation: " + editTermRelation.intentName);
    let promise = new Promise(function(resolve, reject) {
        logger.debug(editTermRelation.intentName);
        if (!editTermRelation.intentName || !editTermRelation.termName) {
            reject({
                error: 'Invalid Intent or term name..!'
            });
        }
        async.waterfall([
                function(callback) {
                    subjectObjectNeo4jController.getPublishEditedIntentTermRelationCallback(editTermRelation, callback);
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

//Ading new subConcept to a existing concept

let publishNewSubConcept = function(addSubconcept) {
   logger.debug("Received request for publishing new subConcept to the concept: " + addSubconcept.subject);
   let promise = new Promise(function(resolve, reject) {
       logger.debug(addSubconcept.subject);
       if (!addSubconcept.subjectNode || !addSubconcept.objectNode) {
           reject({
               error: 'Invalid concept or subConcept name..!'
           });
       }
       async.waterfall([
               function(callback) {
                   subjectObjectNeo4jController.getPublishSubConceptCallback(addSubconcept, callback);
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

let deleteRelation = function(deleteObj) {
   logger.debug("Received request for deleting the relationship between " + deleteObj.subject + " and " + deleteObj.object);
   let promise = new Promise(function(resolve, reject) {
       async.waterfall([function(callback) {
               subjectObjectNeo4jController.getDeleteRelationCallback(deleteObj, callback);
           }],
           function(err, result) {
               if (err) {
                   reject(err);
               }
               resolve(result);
           }); //end of async.waterfall
   });
   return promise;
}

module.exports = {
    publishNewAddItem: publishNewAddItem,
    getObjects: getObjects,
    publishNewSubConcept: publishNewSubConcept,
    publishEditedIntentTermRelation: publishEditedIntentTermRelation,
    deleteRelation: deleteRelation
}
