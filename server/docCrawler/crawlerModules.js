const fs = require('fs');
const async = require('async');
const cheerio = require('cheerio');
const request = require('request');
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
          logger.debug("successfully saved the document")
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
  let promise = new Promise(function(resolve, reject) {
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
        // logger.debug('parseText: ', body);
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

const extractData = function(data) {

  let promise = new Promise(function(resolve, reject) {
        async.waterfall([
            /* get the DOM MODEL to traverse the web document accordingly */
            async.apply(readFile, data),
            async.asyncify(function (modelObj) {
              logger.debug("modelObj: ", modelObj);
                  let termOptimalWeight = 0;
                  let terms = [];
                  data.interestedTerms.forEach(function(item, index) {
                      let termWeight = createTreeOfWebDocLike(data.text, modelObj, data.interestedTerms[index]);
                      logger.debug("termWeight: ", termWeight);
                      logger.debug("Interested Terms ",data.interestedTerms[index])
                      termOptimalWeight = parseInt(termWeight.maxWeight) + parseInt(termWeight.totalWeight);
                      logger.debug("termOptimalWeight: ",termOptimalWeight);
                      terms.push({
                          word: data.interestedTerms[index],
                          intensity: termOptimalWeight
                      });
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
                })
        ]);
    })
    return promise;
}

const readFile = function(data, callback) {
    fs.readFile('cypher.json', function(err,data) {
      callback(null, data.toString());
    })
}

const createTreeOfWebDocLike = function(pageResponse, modelObj, needle) {
    let currentTree = {},
        parent = {},
        foundHtml = '',
        data = { tree: {}, pathWeights: {} },
        pathWeight = 0,
        eltNweight = {};

    function traverseNode(parent, modelObj) {
        let eltName = modelObj.title;
        let foundEltNweight = {};
        let currentNode = { title: modelObj.title, weight: modelObj['child.weight'] };

        $ = cheerio.load(pageResponse);

        foundHtml = $(eltName + ':contains(' + needle + ')').text().trim();
        if (foundHtml != '') {
            pathWeight = pathWeight + parseInt(currentNode.weight);
            addChild(currentTree, parent, currentNode);
        }
        if (typeof modelObj.child != "undefined" && typeof modelObj.child == "object") {
            parent = currentNode;
            Object.keys(modelObj.child).map(function(key, index) {
                return traverseNode(parent, modelObj.child[key]);
            });
        }
        if (typeof modelObj.child == "undefined" & pathWeight != 0) {
            if (typeof data['pathWeights'][eltName] == "undefined") {
                data['pathWeights'][eltName] = pathWeight;
            }
        }
        pathWeight = 0;
        data['tree'] = currentTree;
        let weightsArr = [],
            maxWeight = 0,
            totalWeight = 0,
            currentWeight;
        Object.keys(data['pathWeights']).map(function(k) {
            weight = data['pathWeights'][k];
            totalWeight = totalWeight + weight;
            weightsArr.push(weight);
        });
        if(weightsArr.length!=0)
        {maxWeight = Math.max.apply(null, weightsArr);}
        logger.debug("max-weight of term", maxWeight);
        return { maxWeight: maxWeight, totalWeight: totalWeight,pathWeights: data['pathWeights'] };
    }

    function addChild(currentNode, parent, childnode) {
        if (Object.keys(currentTree).length === 0) {
            currentTree = childnode;
            return;
        }
        if (currentNode.title == parent.title) {
            if (typeof currentNode.child == "undefined") {
                currentNode['child'] = [];
            }
            currentNode['child'].push(childnode);
            return;
        }
        if (typeof currentNode.child != "undefined" && typeof currentNode.child == "object") {
            Object.keys(currentNode.child).map(function(key, index) {
                addChild(currentNode.child[key], parent, childnode);
            });
        }
        return;
    }
    return traverseNode(parent, modelObj);
}


module.exports = {
 termsFinder: termsFinder,
 indexUrl: indexUrl,
 getIntents: getIntents,
 saveWebDocument: saveWebDocument,
 extractData: extractData,
 createTreeOfWebDocLike: createTreeOfWebDocLike,
 parseText: parseText
}