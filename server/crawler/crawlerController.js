'use strict';
const logger = require('./../../applogger');

const crawlerModules = require('./crawlerModules');

const getData = function(id, callback) {

 console.log("im getting")
 console.log(crawlerModules.getDocDataController(id));
 // console.log(returnData);

}
module.exports = {
 getData: getData
};