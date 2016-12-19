
const keyword_extractor = require("keyword-extractor");
const crawlerNeo4jController = require('./crawlerNeo4jController');
const crawlerMongoController = require('./crawlerMongoController');
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
  console.log("in extract data")
  return data;
}

let termsFinder =function(data){
  let promise = new promise(
    function(resolve, reject){
      crawlerNeo4jController.getTerms(data)
      .then(function(data){
        logger.debug("sucessfully got the intent of all domain");
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

const termDensity=function(data){
  let corpus = [];
  data.text.forEach(function (word) {
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
  console.log("in term density")
  data.allTerms = corpus;
  return data
}

const interestedWords=function(data){
 let concept = [];
 let otherWords =[];
 for (let prop in data.allTerms) {

  if(data.intrestedTerms.includes(prop))
  {
    concept.push({
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
console.log("returning the final result")
data.concept = concept;
data.otherWords = otherWords;
return data;
}

let indexUrl =function(data){
  let promise = new promise(
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
  let promise = new promise(
    function(resolve, reject){
      crawlerMongoController.mapWebDocument(data)
      .then(function(data){
        logger.debug("sucessfully saved the document")
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

module.exports = {
 interestedWords:interestedWords,
 termDensity:termDensity,
 termsFinder: termsFinder,
 indexUrl: indexUrl,
 saveWebDocument:saveWebDocument,
 extractData:extractData
}
