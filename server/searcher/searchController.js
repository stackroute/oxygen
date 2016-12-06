'use strict';

const logger = require('./../../applogger');
const searchModel = require('./searchEntity').searchModel;
const async = require('async');
const docSearchJobModel = require('./../docSearchJob/docSearchJobEntity').docSearchJobModel;
const Request = require('superagent');

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

    let engine = jobDetails.engineID.split(' ');
    console.log('ingineee');
    let engID = engine[0];
    let key=engine[1];
   // let engID1='015901048907159908775:bu8jkb0g1c0';
    //let key1='AIzaSyBb4sbJNrnGmPmHiwEOxtF_ZEbcRBzNr60';    
    let stack=[];

    for(let k=1;k<jobDetails.results;k+=10)
      stack.push(async.apply(getURL,jobDetails.query,engID,key,k,jobDetails.results));


    async.parallel(stack,function(err,res){
      let count=0;
      let send=[];
      res.map((ele,i)=>{
        console.log(ele.length);
        count+=ele.length;
        ele.map((data,i)=>{
          send.push(data);
          let saveUrl=new searchModel(data);
          saveUrl.save(function (err) {
            if (err) {
              console.log(err);
            }
            else {
              console.log("saved "+i);
            }
          });

        })
        
      })
      return callback(null, {'saved urls':send.length,'content':send});
    })

  });
};

const getURL= function(query,engID1,key1,i,limit,callback)
{
  let url="https://www.googleapis.com/customsearch/v1?q="+query+"&cx="+engID1+"&key="+key1+"&start="+i;
  let searchResults=[];
  console.log(url+" "+limit);
  Request
  .get(url)
  .end(function(err,body)
  {
    if(err)
      console.log(body.text);

    let data = JSON.parse(body.text);        
    for (let k = 0; k < data.items.length; k++) {
      let searchResult={"query":query,"title":data.items[k].title,"url":data.items[k].link,"description":data.items[k].snippet};
      if((i+k)<=limit)
        searchResults.push(searchResult);  
      else     
        break;
    }
    callback(null,searchResults);
   // console.log(searchResults);

 });  

}

module.exports = {
  storeURL: storeURL,
  getURL:getURL,
};


