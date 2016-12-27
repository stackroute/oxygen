const highland = require('highland');
const parserModules = require('./docParserModules');
const logger = require('./../../applogger');
const request= require('request');
require('events').EventEmitter.defaultMaxListeners = Infinity;

const intentParser= function(data)
{
  let processors = [];
   data=JSON.parse(data);
  logger.debug("after parsing "+data);

  processors.push(highland.map(function(data){
    logger.debug("inside fetchIntentSpecificTerms");
    let promise = parserModules.fetchIntentSpecificTerms(data);
    return promise;
  }));

  processors.push(highland.flatMap(promise => highland(promise.then(function(result){ return result; }, function(err){ return err; }))));


  processors.push(highland.map(function(data){
    logger.debug("inside findIntentIntensity");
    let processedInfo=parserModules.findIntentIntensity(data)
    return processedInfo;
  }));

  processors.push(highland.map(function(data){
        logger.debug("inside conceptDocumentRelationship");
        let promise = parserModules.conceptDocumentRelationship(data);
        return promise;
  }));

  processors.push(highland.flatMap(promise => highland(promise.then(function(result){ return result; }, function(err){ return err; }))));

//creating the pipeline for intent parser
let dataArr=[];
dataArr.push(data);
highland(dataArr)
.pipe( highland.pipeline.apply(null, processors))
.each(function(data){
  console.log("result : ", data.intensity);
});

}

module.exports = {
 intentParser: intentParser
};
