
const keyword_extractor = require("keyword-extractor");
const crawlerNeo4jController = require('./crawlerNeo4jController');
const crawlerMongoController = require('./crawlerMongoController');
const logger = require('./../../applogger');
require('events').EventEmitter.defaultMaxListeners = Infinity;

const extractData=function(data){
  //filtering out the unwanted data from fetched data like stop words using library
  let txt = keyword_extractor.extract(data.text,
  {
    language:"english",
    remove_digits: true,
    return_changed_case:true,
    remove_duplicates: false
  })
  data.text = txt;
  logger.debug("Extracting the content from the URL");
  return data;
}

let termsFinder = function(data){
  let promise = new Promise(function(resolve,reject){
    logger.debug('Trying to get the terms...!');
    crawlerNeo4jController.getTerms(data)
    .then(function(data){
      logger.debug("sucessfully got ALL TERMS OF THE domain");
      resolve(data);
    },
    function(err){
      logger.error("Encountered error in publishing a new " , err)
      reject(err);
    })

  })

  return promise
}

const termDensity=function(data){
  let conceptInDoc = [];
  data.text.forEach(function (word) {
    if (word.length > 20) {
     return;
   }
   if (conceptInDoc[word]) {
    conceptInDoc[word]+=1;
  }
  else {
   conceptInDoc[word] = 1;
 }
})
  logger.debug("Finding all the terms in the webDocument ")
  data["allTerms"] = conceptInDoc;
  return data
}

const interestedWords=function(data){
 let terms = [];
 let otherWords =[];
 for (let prop in data.allTerms) {

  //console.log(data.intrestedTerms);
  if(data.interestedTerms.includes(prop))
  {
    terms.push({
      word:prop,
      intensity:data.allTerms[prop]
    });
  }
  else
  {
    otherWords.push({
      word:prop,
      intensity:data.allTerms[prop]
    });
  }
}
logger.debug("Finding the terms and otherWords from the webDocuments ")
data.terms = terms;
data.otherWords = otherWords;
console.log(data.terms)
return data;
}

let indexUrl =function(data){
  let promise = new Promise(
    function(resolve, reject){
      crawlerNeo4jController.getUrlIndexed(data)
      .then(function(data){
        logger.debug("successfully indexed the url")
        resolve(data);
      },
      function(err){
        logger.error("Encountered error in publishing a new " , err)
        reject(err);
      })
    }
    )
  return promise
}

let saveWebDocument = function(data){
  let promise = new Promise(
    function(resolve, reject){
      crawlerMongoController.saveNewWebDocument(data.data)
      .then(function(mongoData){
        logger.debug("sucessfully saved the document")
        logger.debug("after mongo saving "+data.intents)
        resolve(data);
      },
      function(err){
        logger.error("Encountered error in saving " , err)
        reject(err);
      })
    }
    )
  return promise
}

let parseEachIntent = function(dataWithIntentColln){
  let data=dataWithIntentColln.data;
   let intents=dataWithIntentColln.intents;
  logger.debug("parseEachIntent "+data.domain)
   logger.debug("parseEachIntent "+intents)
   intents.forEach(function(intent){
     data['intent']=intent;

     return data;
   })
}

module.exports = {
 interestedWords:interestedWords,
 termDensity:termDensity,
 termsFinder: termsFinder,
 indexUrl: indexUrl,
 saveWebDocument:saveWebDocument,
 extractData:extractData,
 parseEachIntent:parseEachIntent
}
