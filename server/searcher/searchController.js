'use strict';

const logger = require('./../../applogger');
const searchModel = require('./searchEntity').searchModel;
const async = require('async');
const docSearchJobModel = require('./../docSearchJob/docSearchJobEntity').docSearchJobModel;
const Request = require('superagent');

const getURL= function(jobDetails,i,callback)
{
  let eng=jobDetails.engineID.split(' ');
  let url="https://www.googleapis.com/customsearch/v1?q="+
  jobDetails.query+"&cx="+eng[0]+"&key="+eng[1]+"&start="+i;
  let searchResults=[];
  console.log(url+" "+jobDetails.results);
  Request
  .get(url)
  .end(function(err,body)
  {
    if(err)
    {
      console.log(body.text);
    }

    let data = JSON.parse(body.text);        
    for (let k = 0; k < data.items.length; k+=1) {
      let searchResult={
        "query":jobDetails.query,
        "title":data.items[k].title,
        "url":data.items[k].link,
        "description":data.items[k].snippet
      };
      if((i+k)<=jobDetails.results)
        {searchResults.push(searchResult);}  
      else     
        {break;}
    }
    callback(null,searchResults);
   // console.log(searchResults);

 });  

}

const storeURL = function(id, callback) {  
  const query = {
    _id: id
  };
  
  docSearchJobModel.findOne(query, function(err, jobDetails) {
    if (err) {
      logger.error(
        "Encountered error at SearchController::docSearchJobModel, error: ",
        err);
      return callback(err, {});
    }

    if (!jobDetails) {
      logger.error("No such job Found");
      return callback('job not available or not found..!', {});
    }

    console.log('in search server');  
    let stack=[];

    for(let k=1;k<jobDetails.results;k+=10){
      stack.push(async.apply(getURL,jobDetails,k));
    }


    let sendData=async.parallel(stack,function(errs,res){
      let send=[];
      res.map((ele,i)=>{
        console.log(ele.length);
        ele.map((data)=>{
          send.push(data);
          let saveUrl=new searchModel(data);
          saveUrl.save(function (save_err) {
            if (save_err) {
              console.log(save_err);
            }
            else {
              console.log("saved "+i);
            }
          });

        })
        
      })
      return callback(null, {'saved urls':send.length,'content':send});
    })
    return sendData;
  });
  

};



module.exports = {
  storeURL: storeURL,
  getURL:getURL
};


