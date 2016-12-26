const highland = require('highland');
const crawlerModules = require('./crawlerModules');
const logger = require('./../../applogger');
const request= require('request');
const cheerio = require("cheerio");
const startIntentParser = require('./docOpenIntentParserEngine').startIntentParser;
require('events').EventEmitter.defaultMaxListeners = Infinity;

const urlIndexing= function(data)
{
  let processors = [];
  processors.push(highland.map(function(dataToProcess){
    let processedInfo=crawlerModules.extractData(dataToProcess)
    return processedInfo;
  }));

  processors.push(highland.map(function(dataToFindTerms){
    let promise = crawlerModules.termsFinder(dataToFindTerms);
    return promise;
  }));

  processors.push(highland.flatMap(
    promise => highland(
      promise.then(
        function(result){ return result; },
        function(err){ return err; }
        ))));

  processors.push(highland.map(function(dataToGetTermDensity){
    let processedInfo=crawlerModules.termDensity(dataToGetTermDensity)
    return processedInfo;
  }));

  processors.push(highland.map(function(dataforIntrestedTerms){
    let processedInfo=crawlerModules.interestedWords(dataforIntrestedTerms)
    return processedInfo;
  }));

  processors.push(highland.map(function(dataToIndexURL){
    let promise=crawlerModules.indexUrl(dataToIndexURL)
    return promise

  }));
  processors.push(highland.flatMap(
    promise => highland(
      promise.then(
        function(result){ return result; }, 
        function(err){ return err; }
        ))));

  processors.push(highland.map(function(webDocument){
    let promise=crawlerModules.saveWebDocument(webDocument)
    return promise
  }));
  processors.push(highland.flatMap(
    promise => highland(
      promise.then(
        function(result){ return result; },
        function(err){ return err; }
        ))));

  processors.push(highland.map(function(dataForParseIntents){
    let processedInfo=crawlerModules.parseEachIntent(dataForParseIntents)
    return processedInfo;
  }));
  let dataObj=JSON.parse(data);
  let text;
  request.get(dataObj.url, function (error, response, body) {
    let page = cheerio.load(body);

    text = page("body").text();
    text = text.replace(/\s+/g, " ")
    .replace(/[^a-zA-Z ]/g, "")
    .toLowerCase();
    logger.debug("created texts for "+dataObj.url)
    dataObj.text=text;
    let dataArr=[];
    dataArr.push(dataObj);
    highland(dataArr)
    .pipe( highland.pipeline.apply(null, processors))
    .each(function(res){
      logger.debug("At consupmtion Intent : "+dataObj.intent);
      logger.debug(res);
      startIntentParser(dataObj);
    });

  });


}

module.exports = {
 urlIndexing: urlIndexing
};
