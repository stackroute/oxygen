'use strict';

const ontologyMgrNeo4jController = require('./ontologyMgrNeo4jController');
const domainMongoController = require('../domains/domainMongoController');
const logger = require('./../../applogger');
const config = require('./../../config');
const graphConsts = require('./../common/graphConstants');
const async = require('async');

let deleteOrphans = function(deleteObj) {
    logger.debug("Received request for deleting the nodes who doesn't left with any relation " + deleteObj.nodeName);
    let promise = new Promise(function(resolve, reject) {
        async.waterfall([function(callback) {
                domainMongoController.checkDomainCallback(deleteObj.domainName,callback);
              },function(checkedDomain, callback){
                ontologyMgrNeo4jController.deleteOrphansCallback(deleteObj, callback);
              }
            ],
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
}

let publishAllRelations = function(subject) {
    logger.debug("Received request for retreiving :", subject.nodetype, " and :", subject.nodetype1);
    let promise = new Promise(function(resolve, reject) {
        async.waterfall([
                function(callback) {
                    ontologyMgrNeo4jController.getAllRelationsCallback(subject, callback)
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
}
module.exports = {
    deleteOrphans: deleteOrphans,
    publishAllRelations: publishAllRelations,
    publishRelations: publishRelations
}
