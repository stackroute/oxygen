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

  processors.push(highland.map(function(data){
    let processedInfo=crawlerModules.extractData(data)
    return processedInfo;
  }));

    processors.push(highland.map(function(data){

          logger.debug("");

          let send=callback=>parserModules.termsFinder(data)
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
    let processedInfo=crawlerModules.termDensity(data)
    return processedInfo;
  }));
indexUrl
  processors.push(highland.map(function(data){
    let processedInfo=crawlerModules.interestedWords(data)
    return processedInfo;
  }));

  processors.push(highland.map(function(data){

        logger.debug("");

        let send=callback=>parserModules.indexUrl(data)
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

          logger.debug("");

          let send=callback=>parserModules.saveWebDocument(data)
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
//creating the pipeline for crawler
const url = {
  _id: data.url;
};

  let text;
  request.get(data.url, function (error, response, body) {
    let page = cheerio.load(body);

    text = page("body").text();
    text = text.replace(/\s+/g, " ")
    .replace(/[^a-zA-Z ]/g, "")
    .toLowerCase();
    console.log("created texts for "+data.url)
    data.text=text;
    highland(data)
    .pipe( highland.pipeline.apply(null, processors))
    .each(function(res){
      console.log("result : ", res);
    startIntentParser(res);
     });

  });


}

module.exports = {
 urlIndexing: urlIndexing
};
