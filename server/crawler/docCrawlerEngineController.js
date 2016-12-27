const highland = require('highland');
const crawlerModules = require('./crawlerModules');
const searchModel = require('../searcher/searchEntity').searchModel;
const logger = require('./../../applogger');
const request= require('request');
const cheerio = require("cheerio");
const startIntentParser = require('./docOpenIntentParserEngine').startIntentParser;
require('events').EventEmitter.defaultMaxListeners = Infinity;

const urlIndexing= function(data)
{
  let processors = [];
  data=JSON.parse(data);
  processors.push(highland.map(function(data){
    let processedInfo=crawlerModules.extractData(data)
    return processedInfo;
  }));

  processors.push(highland.map(function(data){
    let promise = crawlerModules.termsFinder(data);
    return promise;
  }));

  processors.push(highland.flatMap(promise => highland(promise.then(function(result){ return result; }, function(err){ return err; }))));

  processors.push(highland.map(function(data){
    let processedInfo=crawlerModules.termDensity(data)
    return processedInfo;
  }));

  processors.push(highland.map(function(data){
    let processedInfo=crawlerModules.interestedWords(data)
    return processedInfo;
  }));

  processors.push(highland.map(function(data){
    let promise=crawlerModules.indexUrl(data)
    return promise

  }));
  processors.push(highland.flatMap(promise => highland(promise.then(function(result){ return result; }, function(err){ return err; }))));

  processors.push(highland.map(function(data){
    let promise=crawlerModules.saveWebDocument(data)
    return promise
  }));
  processors.push(highland.flatMap(promise => highland(promise.then(function(result){ return result; }, function(err){ return err; }))));

  processors.push(highland.map(function(data){
    let processedInfo=crawlerModules.parseEachIntent(data)
    return processedInfo;
  }));

  const url = {
    _id: data.url
  };

  let text;
  request.get(data.url, function (error, response, body) {
    let page = cheerio.load(body);

    text = page("body").text();
    text = text.replace(/\s+/g, " ")
    .replace(/[^a-zA-Z ]/g, "")
    .toLowerCase();
    logger.debug("created texts for "+data.url)
    data.text=text;
    let dataArr=[];
    dataArr.push(data);
    highland(dataArr)
    .pipe( highland.pipeline.apply(null, processors))
    .each(function(res){
      logger.debug("At consupmtion Intent : "+data.intent);
      logger.debug(res);
      startIntentParser(data);
});

  });


}

module.exports = {
 urlIndexing: urlIndexing
};
