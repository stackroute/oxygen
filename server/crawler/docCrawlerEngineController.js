
const amqp = require('amqplib/callback_api');
const highland = require('highland');
const crawlerModules = require('./crawlerModules');
const searchModel = require('../searcher/searchEntity').searchModel;
const logger = require('./../../applogger');
const request= require('request');
const cheerio = require("cheerio");
require('events').EventEmitter.defaultMaxListeners = Infinity;

amqp.connect(process.env.RABBITMQ, function(err, conn) {
  conn.createChannel(function(errs, ch) {
    let q = 'crawler';
    ch.assertQueue(q, {durable: false});
    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q);
    ch.consume(q, function(msg) {
      getData(msg.content.toString());

    }, {noAck: true});
  });
});

const getData= function(urlId)
{
  let processors = [];

  processors.push(highland.map(function(data){
    let processedInfo=crawlerModules.extractData(data)
    return processedInfo;
  }));

  processors.push(highland.map(function(data){
    let processedInfo=crawlerModules.termDensity(data)
    return processedInfo;
  }));

  processors.push(highland.map(function(data){
    let processedInfo=crawlerModules.interestedWords(data)
    return processedInfo;
  }));
//creating the pipeline for crawler
const url = {
  _id: urlId
};
searchModel.findOne(url, function(err, urlDetails) {
  console.log("starting in findone "+urlDetails.url)
  if (err) {
    logger.error('Encountered error at crawlerController::searchModel, error: ', err);
    return err;
  }
  if (!urlDetails) {
    logger.error('No search results Found');
    return err;
  }
  let text;
  request.get(urlDetails.url, function (error, response, body) {
    let page = cheerio.load(body);

    text = page("body").text();
    text = text.replace(/\s+/g, " ")
    .replace(/[^a-zA-Z ]/g, "")
    .toLowerCase();
    console.log("created texts for "+urlDetails.url)
    let urlArray=[];
    urlArray.push(text);
    highland(urlArray)
    .pipe( highland.pipeline.apply(null, processors))
    .each(function(obj){
      console.log("result : ", obj);
  // console.log("Data: ", JSON.stringify(data));
});

  })

});
}
