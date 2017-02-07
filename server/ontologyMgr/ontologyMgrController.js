'use strict';
const ontologyMgrNeo4jController = require('./ontologyMgrNeo4jController');
const logger = require('./../../applogger');
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


module.exports = {
  getAllDomainDetails: getAllDomainDetails,
  getSubjectObjects: getSubjectObjects
}
