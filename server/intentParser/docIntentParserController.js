const highland = require('highland');
const parserModules = require('./docParserModules');
const logger = require('./../../applogger');
const datapublisher = require('../serviceLogger/redisLogger');

require('events').EventEmitter.defaultMaxListeners = Infinity;

const intentParser = function(data) {
  let processors = [];
  logger.debug('Test Data: ', data);

  processors.push(highland.map(function(dataToProcess) {
    logger.debug('Test dataToProcess: ', dataToProcess);
    logger.debug("inside fetchIntentSpecificTerms");
    let promise = parserModules.fetchIntentSpecificTerms(dataToProcess);
    return promise;
  }));

  processors.push(highland.flatMap(promise => highland(
    promise.then(
      function(result) {
        return result; 
      },
      function(err) {
        return err; 
      })
    )));

  processors.push(highland.map(function(intentIntensityData) {
    logger.debug("inside findIntentIntensity");
    let processedInfo = parserModules.findIntentIntensity(intentIntensityData)
    return processedInfo;
  }));

  processors.push(highland.map(function(conceptDocumentRelationshipData) {
    logger.debug("inside conceptDocumentRelationship");
    let promise = parserModules.conceptDocumentRelationship(conceptDocumentRelationshipData);
    return promise;
  }));

  processors.push(highland.flatMap(promise => highland(
    promise.then(
      function(result) {
        return result; },
      function(err) {
        return err; }
    ))));

  //creating the pipeline for intent parser
  let dataObj = JSON.parse(data);
  logger.debug("after parsing ")
  logger.debug(dataObj);
  let dataArr = [];
  dataArr.push(dataObj);
  
  highland(dataArr)
    .pipe(highland.pipeline.apply(null, processors))
    .each(function(result) {
      logger.debug("result : ", result.intensity);
      let redisIntent = {
        actor: 'intent parser',
        status: 'intent parsing completed for the particular intent'
      }
      datapublisher.processFinished(redisIntent);
      parserModules.latestNoOfDocs(dataObj.domain);
    });

}

module.exports = {
  intentParser: intentParser
};
