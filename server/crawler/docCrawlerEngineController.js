const highland = require('highland');
const crawlerModules = require('./crawlerModules');
const logger = require('./../../applogger');
const request = require('request');
const cheerio = require("cheerio");
const startIntentParser = require('./docOpenIntentParserEngine').startIntentParser;
require('events').EventEmitter.defaultMaxListeners = Infinity;
const urlIndexing = function(data) {
  let processors = [];
  processors.push(highland.map(function(dataToFindTerms) {
    let promise = crawlerModules.termsFinder(dataToFindTerms);
    return promise;
  }));
  processors.push(highland.flatMap(
    promise => highland(
      promise.then(
        function(result) {
          return result;
        },
        function(err) {
          return err;
        }
        ))));
  processors.push(highland.map(function(dataToProcess) {
    let processedInfo = crawlerModules.extractData(dataToProcess)
    return processedInfo;
  }));
  processors.push(highland.map(function(dataToIndexURL) {
    let promise = crawlerModules.indexUrl(dataToIndexURL)
    return promise
  }));
  processors.push(highland.flatMap(
    promise => highland(
      promise.then(
        function(result) {
          return result;
        },
        function(err) {
          return err;
        }
        ))));
  processors.push(highland.map(function(webDocument) {
    let promise = crawlerModules.saveWebDocument(webDocument)
    return promise
  }));
  processors.push(highland.flatMap(
    promise => highland(
      promise.then(
        function(result) {
          return result;
        },
        function(err) {
          return err;
        }
        ))));
  processors.push(highland.map(function(webDocument) {
    let promise = crawlerModules.getIntents(webDocument)
    return promise
  }));
  processors.push(highland.flatMap(
    promise => highland(
      promise.then(
        function(result) {

          return result;
        },
        function(err) {
          return err;
        }
        ))));
  let dataObj = JSON.parse(data);
  let text;
  request.get(dataObj.url, function(error, response, body) {
   if (!error && response.statusCode == 200) {
    let page = cheerio.load(body);
    if( typeof dataObj.title === 'undefined' && typeof dataObj.description === 'undefined')
    {
      let meta = page('meta')
      let keys = Object.keys(meta)
      let ogType;
      let ogTitle;
      let desc;
      keys.forEach(function(key){
        if (meta[key].attribs
         && meta[key].attribs.property
         && meta[key].attribs.property === 'og:type') {
          ogType = meta[key].attribs.content;
      }
    });
      keys.forEach(function(key){
        if (meta[key].attribs
         && meta[key].attribs.property
         && meta[key].attribs.property === 'og:title') {
          ogTitle = meta[key].attribs.content;
      }
    });
      keys.forEach(function(key){
        if (meta[key].attribs
          && meta[key].attribs.property
          && meta[key].attribs.property === 'og:description') {
          desc = meta[key].attribs.content;
      }
    });
      if(!ogTitle && !desc)
      {
       dataObj.title = ogTitle;
       dataObj.description = desc;
       logger.debug(ogType);
       logger.debug(ogTitle);
       logger.debug(desc);
     }
     else
     {
      logger.debug('cherio also returned null');
      dataObj.title = dataObj.concept;
      dataObj.description = 'Not Mentioned';
    }
  }
  text = page("body").text();
  text = text.replace(/\s+/g, " ")
  .replace(/[^a-zA-Z ]/g, "")
  .toLowerCase();
  logger.debug("created texts for " + dataObj.url)
  dataObj.text = text;
  let dataArr = [];
  dataArr.push(dataObj);
  highland(dataArr)
  .pipe(highland.pipeline.apply(null, processors))
  .each(function(res) {
    logger.debug("At consupmtion Intent : ");
    logger.debug(res);
    let intents=res.intents;
    delete res.intents
    logger.debug(intents);   
    intents.forEach(function(intent) {
      logger.debug(" at each intent to send as msg ", intent)
      let obj= JSON.parse(JSON.stringify(res.data));
      obj.intent = intent;
      logger.debug("printing the msg to send to parser");
      logger.debug(obj);
      startIntentParser(obj);
    })

  });
}
});
}
module.exports = {
  urlIndexing: urlIndexing
};