'use strict';
const ontologyMgrNeo4jController = require('./ontologyMgrNeo4jController');
const logger = require('./../../applogger');
const datapublisher = require('../serviceLogger/redisLogger');
const domainMongoController = require('../domains/domainMongoController');
const config = require('./../../config');
const graphConsts = require('./../common/graphConstants');
const async = require('async');

let getAllDomainDetails = function(domain) {
    logger.debug('Received request for retriving Objects',
        domain.name);
    // Save to Mongo DB
    // Save to Neo4j

    let promise = new Promise(function(resolve, reject) {
        async.waterfall([
                function(callback) {
                    ontologyMgrNeo4jController.getAllDomainDetailsCallback(
                        domain,
                        callback);
                }
            ],
            function(err, retrivedRelations) {
                if (err) {
                    reject(err);
                }
                resolve(retrivedRelations);
                let redisCrawl = {
                  domain: dataObj.domain,
                  actor: 'crawler',
                  message: dataObj.url,
                  status: 'crawling completed for the url'
                };
                datapublisher.processFinished(redisCrawl);
            });
    });
    return promise;
};

let getSubjectObjects = function(nodeObj) {
    logger.debug('Received request for retriving Objects',
        nodeObj.nodename);
    // Save to Mongo DB
    // Save to Neo4j

    let promise = new Promise(function(resolve, reject) {
        async.waterfall([
                function(callback) {
                    ontologyMgrNeo4jController.getSubjectObjectsCallback(
                        nodeObj,
                        callback);
                }
            ],
            function(err, retrivedRelations) {
                if (err) {
                    reject(err);
                }
                resolve(retrivedRelations);
                // let redisCrawl = {
                //  domain:nodeObj.domainName,
                //   // actor: 'crawler',
                //   // message: 'world',
                //   // status: 'crawling completed for the url'
                //   message: retrivedRelations,
                // };
                // datapublisher.processFinished(redisCrawl);
            });
    });
    return promise;
};

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
                });
                // End of waterfall
        }
    });
    // End of Promise
    return promise;
};

let deleteObject = function(deleteObj) {
    logger.debug('ontologyMgrController', deleteObj);
    logger.debug('Received request for deleting an Object', deleteObj.objNodeName);

    let promise = new Promise(function(resolve, reject) {
        async.waterfall([function(callback) {
                logger.debug('inside waterfall:neo4jdelete', deleteObj);
                ontologyMgrNeo4jController.deleteObjectCallback(deleteObj, callback);
            }],
            function(err, result) {
                if (err) {
                    reject(err);
                }
                resolve(result);
                console.log(result);
                let redis = {
                 domain:deleteObj.domainName,
                  // actor: 'crawler',
                  // message: 'world',
                  // status: 'crawling completed for the url'
                  message: deleteObj.predicateName,
                };
                datapublisher.editData(redis);

                });
             // end of async.waterfall
    });
    return promise;
};

let deleteOrphans = function(deleteObj) {
    logger.debug('Received request for deleting the nodes who do not left with any relation ' + deleteObj.nodeName);
    let promise = new Promise(function(resolve, reject) {
        async.waterfall([function(callback) {
                domainMongoController.checkDomainCallback(deleteObj.domainName, callback);
            }, function(checkedDomain, callback) {
                ontologyMgrNeo4jController.deleteOrphansCallback(deleteObj, callback);
            }],
            function(err, result) {
                if (err) {
                    reject(err);
                }
                resolve(result);
                logger.debug('hello');
                logger.debug(result)
                let redis = {
                   domain:deleteObj.domainName,
                  // actor: 'crawler',
                  // message: 'world',
                  // status: 'crawling completed for the url'
                  message: deleteObj.nodeName,
                };
                datapublisher.editData(redis);
                });
            // end of async.waterfall
    });
    return promise;
};

let publishRelations = function(subject) {
    logger.debug('Received request for retreiving :', subject.nodetype, ' and :', subject.nodetype1);
    let promise = new Promise(function(resolve, reject) {
        async.waterfall([
                function(callback) {
                    ontologyMgrNeo4jController.getRelationsCallback(subject, callback);
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
    logger.debug('Received request for retreiving :', subject.nodetype, ' and :', subject.nodetype1);
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

let getAllOrphans = function(nodeObj) {
    let promise = new Promise(function(resolve, reject) {
        async.waterfall([
                function(callback) {
                    ontologyMgrNeo4jController.getAllOrphansCallback(nodeObj, callback);
                }
            ],
            function(err, retrievedObjects) {
                if (err) {
                    reject(err);
                }
                resolve(retrievedObjects);
                  logger.debug('hello');
                logger.debug(retrievedObjects);
            });
    });
    return promise;
};

let getSearch = function(nodeObj) {
    logger.debug('Received request for retriving Objects',
        nodeObj.nodename);
    // Save to Mongo DB
    // Save to Neo4j

    let promise = new Promise(function(resolve, reject) {
        async.waterfall([
                function(callback) {
                    ontologyMgrNeo4jController.getSearchCallback(
                        nodeObj,
                        callback);
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
};

let createResource = function(nodeObj) {
    logger.debug('Received request for retriving Objects',
        nodeObj);
    let promise = new Promise(function(resolve, reject) {
        async.waterfall([
                function(callback) {
                    ontologyMgrNeo4jController.createResourceCallback(
                        nodeObj,
                        callback);
                }
            ],
            function(err, createdResource) {
                if (err) {
                    reject(err);
                }
                resolve(createdResource);
                logger.debug( 'hello');
                logger.debug( createdResource);
                let redis = {
                //  nodename:nodeObj.nodename,
                  // actor: 'crawler',
                  // message: 'world',
                  // status: 'crawling completed for the url'
                  message: createdResource,
                };
                datapublisher.editData(redis);
            });
    });
    return promise;
};

let formStatement = function(nodeObj) {
    logger.debug('Received request for retriving Objects',
        nodeObj.nodename);
    let promise = new Promise(function(resolve, reject) {
        async.waterfall([
                function(callback) {
                    ontologyMgrNeo4jController.formStatementCallback(
                        nodeObj,
                        callback);
                }
            ],
            function(err, statement) {
                if (err) {
                    reject(err);
                }
                resolve(statement);
                logger.debug('helloWorld');
                logger.debug(statement);
                let red = {
              //  domain:nodeObj.nodename,
                  // actor: 'crawler',
                  // message: 'world',
                  // status: 'crawling completed for the url'
                  message: statement,
                };
                datapublisher.editData(red);
            });
    });
    return promise;
};

let publishAllAttributes = function(subject) {
    logger.debug('Received request for retreiving :', subject.nodetype, ' and :', subject.nodetype1);
    let promise = new Promise(function(resolve, reject) {
        async.waterfall([
                function(callback) {
                    ontologyMgrNeo4jController.getPublishAllAttributesCallback(subject, callback);
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
// Yogee
let publishEditedSubjectObjectAttributes = function(nodeObj) {
    let promise = new Promise(function(resolve, reject) {
        async.waterfall([
                function(callback) {
                    ontologyMgrNeo4jController.getPublishSubjectObjectAttributesCallback(nodeObj, callback);
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

let getIntentOfDomain = function(domain) {
    logger.debug('ontologyMgrCtrl', domain);
    logger.debug('Received request for retriving domain details ', domain.domainName);

    let promise = new Promise(function(resolve, reject) {
        async.waterfall([
                function(callback) {
                    logger.debug('inside the waterfall ', domain);
                    ontologyMgrNeo4jController.getIntentOfDomainCallback(domain,
                        callback);
                }
            ],
            function(err, tree) {
                logger.debug('got the domain collection', domain);
                if (!err) {
                    resolve(tree);
                }
                reject(err);
            });
             // end of async.waterfall
    });
    return promise;
};

module.exports = {
    publishAddNode: publishAddNode,
    deleteObject: deleteObject,
    deleteOrphans: deleteOrphans,
    publishAllRelations: publishAllRelations,
    publishRelations: publishRelations,
    getAllDomainDetails: getAllDomainDetails,
    getSubjectObjects: getSubjectObjects,
    getSearch: getSearch,
    getAllOrphans: getAllOrphans,
    createResource: createResource,
    formStatement: formStatement,
    publishAllAttributes: publishAllAttributes,
    publishEditedSubjectObjectAttributes: publishEditedSubjectObjectAttributes,
    getIntentOfDomain: getIntentOfDomain
};
