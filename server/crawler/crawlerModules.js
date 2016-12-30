const keyword_extractor = require("keyword-extractor");
const crawlerNeo4jController = require('./crawlerNeo4jController');
const crawlerMongoController = require('./crawlerMongoController');
const logger = require('./../../applogger');
require('events').EventEmitter.defaultMaxListeners = Infinity;
let termsFinder = function(data) {
  let promise = new Promise(function(resolve, reject) {
    logger.debug('Trying to get the terms...!');
    crawlerNeo4jController.getTerms(data)

    .then(function(dataWithTerms) {
      logger.debug("sucessfully got ALL TERMS OF THE domain");
      resolve(dataWithTerms);
    },
    function(err) {
      logger.error("Encountered error in publishing a new ", err)
      reject(err);
    })

  })
  return promise
}
const extractData = function(data) {
  //filtering out the unwanted data from fetched data like stop words using library

  let count = 0;
  let terms = [];
  data.interestedTerms.forEach(function(item, index) {
    let pattern = new RegExp(data.interestedTerms[index], 'gim');
    count = (data.text.match(pattern) || []).length;
    //console.log( item + " " + count);
    terms.push({
      word: data.interestedTerms[index],
      intensity: count
    });
    data.text = data.text.replace(pattern, '');
  })
  let txt = keyword_extractor.extract(data.text, {
    language: "english",
    remove_digits: true,
    return_changed_case: true,
    remove_duplicates: false
  })
  data.text = txt;
  //console.log(terms);
  data.terms = terms;
  logger.debug("Extracting the content from the URL");
  return data;
}
let indexUrl = function(data) {
  let promise = new Promise(
    function(resolve, reject) {
      crawlerNeo4jController.getUrlIndexed(data)
      .then(function(indexedData) {
        logger.debug("successfully indexed the url")
        resolve(indexedData);
      },
      function(err) {
        logger.error("Encountered error in publishing a new ", err)
        reject(err);
      })
    }
  )
  return promise
}
let saveWebDocument = function(data) {
  let promise = new Promise(
    function(resolve, reject) {
      crawlerMongoController.saveNewWebDocument(data)
      .then(function(mongoData) {
        logger.debug("sucessfully saved the document")
        logger.debug(mongoData);
            //logger.debug("after mongo saving " + data.intents)
            resolve(mongoData);
          },
          function(err) {
            logger.error("Encountered error in saving ", err)
            reject(err);
          })
    }
    )
  return promise
}

let getIntents = function(data) {
  let promise = new Promise(
    function(resolve, reject) {
      crawlerNeo4jController.fetchIntents(data)
      .then(function(neoData) {
        logger.debug("sucessfully saved the document")
        logger.debug(neoData);
        logger.debug("after neo4J fetching of intents " , neoData.intents)
        resolve(neoData);
      },
      function(err) {
        logger.error("Encountered error in saving ", err)
        reject(err);
      })
    }
  )
  return promise
}


module.exports = {
 termsFinder: termsFinder,
 indexUrl: indexUrl,
 getIntents:getIntents,
 saveWebDocument:saveWebDocument,
 extractData:extractData
}