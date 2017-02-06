'use strict';
const ontologyMgrNeo4jCtrl = require('./ontologyMgrNeo4jController');
const logger = require('./../../applogger');
const async = require('async');

//This method receives the object that is to be deleted from the api.
//On receiving the object, send it to the Neo4j controller so that it could be deleted from the Graph Database.
//On success, return back a promise to the Router else, return the corresponding error messages.
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
            });//End of async waterfall
    });
    return promise;
};

module.exports = {
    deleteObject: deleteObject
};
