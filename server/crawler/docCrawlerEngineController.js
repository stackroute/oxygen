
#!/usr/bin/env node
const amqp = require('amqplib/callback_api');
const highland = require('highland');
const crawlerModules = require('./crawlerModules');

amqp.connect('amqp://localhost', function(err, conn) {
  conn.createChannel(function(err, ch) {
    let q = 'hello';

    ch.assertQueue(q, {durable: false});
    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q);
    console.log('Divyanshu');
    ch.consume(q, function(msg) {
    console.log(msg.content.toString());
    getData(msg.content.toString());

    }, {noAck: true});
  });
});


const getData= function(urlId)
{
  let processors = [];

  processors.push(highland.map(function(data){
    console.log(data);
  let processedInfo=crawlerModules.getDocDataController(data, (err, result) => {
    if (err) {
    console.log('error: Something went wrong, please try later..!');
    }
    console.log(result)
    return (result);
  });
  console.log("after process "+processedInfo);
    return processedInfo;
  }));

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
let urlArray=[];
urlArray.push(urlId);
highland(urlArray)
.pipe( highland.pipeline.apply(null, processors))
.each(function(obj){
  console.log("Data: ", obj);
  // console.log("Data: ", JSON.stringify(data));
});

}
