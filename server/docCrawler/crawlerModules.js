const keyword_extractor = require("keyword-extractor");
const cheerio = require('cheerio');
const request = require('request');
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
  return promise;
}

const extractData = function(data) {
  let count = 0;
  let terms = [];
  let promise = new Promise(function(resolve, reject) {
      data.interestedTerms.forEach(function(item, index) {
        let pattern = new RegExp(data.interestedTerms[index], 'gim');
        count = (data.text.match(pattern) || []).length;
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
      data.terms = terms;
      logger.debug("Extracting the content from the URL");
      resolve(data);
    },
    function(err) {
      reject(err);
    })
    return promise;
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
    })
  return promise;
}

let saveWebDocument = function(data) {
  let promise = new Promise(function(resolve, reject) {
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
    })
  return promise;
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
    })
  return promise;
}

let parseText = function(dataObj) {
  let promise = new Promise(function(resolve, reject) {
      request.get(dataObj.url, function(error, response, body) {
      if(!error && response.statusCode === 200) {
        let page = cheerio.load(body);
        if (typeof dataObj.title === 'undefined' || typeof dataObj.description === 'undefined' ) {
          let meta = page('meta'),
              keys = Object.keys(meta);
          let ogType,ogTitle,desc;

          logger.debug("fetching the title/description for the url : "+dataObj.url)
          keys.forEach(function(key) {
            if (meta[key].attribs && meta[key].attribs.property &&
                meta[key].attribs.property === 'og:type') {
              ogType = meta[key].attribs.content;
            }
          });
          keys.forEach(function(key) {
            if (meta[key].attribs && meta[key].attribs.property &&
                meta[key].attribs.property === 'og:title') {
              ogTitle = meta[key].attribs.content;
            }
          });
          keys.forEach(function(key) {
            if (meta[key].attribs && meta[key].attribs.property &&
                meta[key].attribs.property === 'og:description') {
              desc = meta[key].attribs.content;
            }
          });
          if (ogTitle && desc) {
            dataObj.title = ogTitle;
            dataObj.description = desc;
            logger.debug(ogType);
            logger.debug(ogTitle);
            logger.debug(desc);
          }
          else {
            logger.debug('cheerio also returned null');
            dataObj.title = dataObj.concept;
            dataObj.description = 'Not Mentioned';
          }
        }
        text = page('body').text();
        // logger.debug('this is the text ' + text);
        text =  text.replace(/\s+/g, ' ')
                    .replace(/[^a-zA-Z ]/g, '')
                    .toLowerCase();
        logger.debug('created texts for ' + dataObj.url);
        dataObj.text = text;
      } else {
        logger.error("[ THIS IS NOT AN ERROR ] sry the url "+dataObj.url+" is not responding")
      }
      resolve(dataObj);
    },
    function (err) {
      reject(err);
    })
  })
  return promise;
}

module.exports = {
 termsFinder: termsFinder,
 indexUrl: indexUrl,
 getIntents: getIntents,
 saveWebDocument: saveWebDocument,
 extractData: extractData,
 parseText: parseText
}