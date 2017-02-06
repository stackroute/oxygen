'use strict';
const ontologyMgrNeo4jCtrl = require('./ontologyMgrNeo4jController');
const logger = require('./../../applogger');
const config = require('./../../config');
const graphConsts = require('./../common/graphConstants');
const async = require('async');

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

module.exports = {
    deleteOrphans: deleteOrphans,
};
