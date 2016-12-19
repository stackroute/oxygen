const highland = require('highland');
const parserModules = require('./docParserModules');
const logger = require('./../../applogger');
const request= require('request');
require('events').EventEmitter.defaultMaxListeners = Infinity;

const intentParser= function(data)
{
  let processors = [];

  processors.push(highland.map(function(data){

    logger.debug("inside 1st func of pipeline");

    let send=callback=>parserModules.fetchIntentSpecificTerms(data)
    .then(
      function(data)
      {
        callback(null,data)
      },
      function(err)
      {
        callback(err,null)
      }
    );
    send(data)
    {
      return data;
    }
}));

  processors.push(highland.map(function(data){
    let processedInfo=parserModules.findIntentIntensity(data)
    return processedInfo;
  }));

  processors.push(highland.map(function(data){

    logger.debug("inside 2nd func of pipeline");

    let send=callback=>parserModules.conceptDocumentRelationship(data)
    .then(
      function(data)
      {
        callback(null,data)
      },
      function(err)
      {
        callback(err,null)
      }
    );
    send(data)
    {
      return data;
    }
}));
//creating the pipeline for intent parser

    highland(data)
    .pipe( highland.pipeline.apply(null, processors))
    .each(function(data){
      console.log("result : ", data);
     });

  })

});
}

module.exports = {
 intentParser: intentParser
};
