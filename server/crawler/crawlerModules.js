const request= require('request');
const cheerio = require("cheerio");
const keyword_extractor = require("keyword-extractor");
const searchModel = require('../searcher/searchEntity').searchModel;
const logger = require('./../../applogger');
const getDocDataController=function(id)
{
  const urlId = {
    _id: id
  };
  let urldata,text;
 console.log("from do data"+id);
  searchModel.findOne(urlId, function(err, urlDetails) {
    if (err) {
      logger.error('Encountered error at crawlerController::searchModel, error: ', err);
      return err;
    }
    if (!urlDetails) {
      logger.error('No search results Found');
      return err;
    }
  console.log(urlDetails);
    urldata=urlDetails
   // return urlDetails;
});
  console.log("async");
   while(urldata === undefined) {
     console.log("urldata waiting..");
    require('deasync').runLoopOnce();
  }


  let data= request.get(urldata.url, function (error, response, body) {
    let page = cheerio.load(body);

    text = page("body").text();
      text = text.replace(/\s+/g, " ")
               .replace(/[^a-zA-Z ]/g, "")
               .toLowerCase();


 })
 while(text === undefined) {
   console.log("text waiting..");
    require('deasync').runLoopOnce();
  }
  return text;
}


const extractData=function(text){
  //filtering out the unwanted data from fetched data like stop words using library

let txt = keyword_extractor.extract(text,
{
    language:"english",
    remove_digits: true,
    return_changed_case:true,
    remove_duplicates: false
})
console.log(txt)
return txt;
}

const termDensity=function(text){
let corpus = [];
text.forEach(function (word) {
  // We don't want to include very short or long words because they're probably bad data.
 if (word.length > 20) {
   return;
 }

 if (corpus[word]) {
   // If this word is already in our corpus,
   //our collection of terms, increase the count for appearances of that word by one.
   corpus[word]+=1;
 } else {
   // Otherwise, say that we've found one of that word so far.
   corpus[word] = 1;
 }
 })
return corpus;
}

const interestedWords=function(corpus){
let result=[];
let intent = [];
let otherWords = [];
let interestwords=['react','tutorial','waste'];
for (let prop in corpus) {

if(interestwords.includes((""+prop)))
{
  intent.push({
        word:prop,
        density:corpus[prop]
    });
}
else
{
  otherWords.push({
        otherWords:prop,
        density:corpus[prop]
    });
}
}
result.push(intent);
result.push(otherWords);
console.log(result);
return result;

}


module.exports = {
 interestedWords:interestedWords,
 getDocDataController:getDocDataController,
 termDensity:termDensity,
 extractData:extractData
};
