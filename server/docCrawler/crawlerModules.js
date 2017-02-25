const fs = require('fs');
const async = require('async');
const cheerio = require('cheerio');
const request = require('request');
const superAgentRequest = require('superagent');
const keyword_extractor = require('keyword-extractor');
const crawlerNeo4jController = require('./crawlerNeo4jController');
const crawlerMongoController = require('./crawlerMongoController');
const logger = require('./../../applogger');

require('events').EventEmitter.defaultMaxListeners = Infinity;

let termsFinder = function (data) {
    let promise = new Promise(function (resolve, reject) {
        logger.debug('Trying to get the terms...!');

        crawlerNeo4jController.getTerms(data)
            .then(function (dataWithTerms) {
                    logger.debug('sucessfully got ALL TERMS OF THE domain');
                    resolve(dataWithTerms);
                },
                function (err) {
                    logger.error('Encountered error in publishing a new ', err);
                    reject(err);
                });
    });
    return promise;
};

let indexUrl = function (data) {
    let promise = new Promise(
        function (resolve, reject) {
            crawlerNeo4jController.getUrlIndexed(data)
                .then(function (indexedData) {
                        logger.debug('successfully indexed the url');
                        resolve(indexedData);
                    },
                    function (err) {
                        logger.error('Encountered error in publishing a new ', err);
                        reject(err);
                    });
        });
    return promise;
};

let saveWebDocument = function (data) {
    let promise = new Promise(function (resolve, reject) {
        crawlerMongoController.saveNewWebDocument(data)
            .then(function (mongoData) {
                    logger.debug('successfully saved the document');
                    logger.debug(mongoData);
                    // logger.debug('after mongo saving ' + data.intents)
                    resolve(mongoData);
                },
                function (err) {
                    logger.error('Encountered error in saving ', err);
                    reject(err);
                });
    });
    return promise;
};
let getIntents = function (data) {
    let promise = new Promise(function (resolve, reject) {
        crawlerNeo4jController.fetchIntents(data)
            .then(function (neoData) {
                    logger.debug('sucessfully saved the document');
                    logger.debug(neoData);
                    logger.debug('after neo4J fetching of intents ', neoData.intents);
                    resolve(neoData);
                },
                function (err) {
                    logger.error('Encountered error in saving ', err);
                    reject(err);
                });
    });
    return promise;
};
let parseText = function (dataObj) {
  logger.debug("Working inside parseText");
    let promise = new Promise(function (resolve, reject) {
        request.get(dataObj.url, function (error, response, body) {
                if (!error && response.statusCode === 200) {
                     //logger.debug('Kowsik in add doc parseText: ', body);
                    let page = cheerio.load(body);
                    if (typeof dataObj.title === 'undefined' || typeof dataObj.description === 'undefined') {
                        let meta;
                         meta = page('meta');
                            keys = Object.keys(meta);

                        let ogType, ogTitle, desc;
                        logger.debug('Kowsik type',ogType);
                        logger.debug("fetching the title/description for the url : " + dataObj.url)
                        keys.forEach(function (key) {
                            if (meta[key].attribs && meta[key].attribs.property &&
                                meta[key].attribs.property === 'og:type') {
                                ogType = meta[key].attribs.content;
                                logger.debug('Kowsik type',ogType);
                            }
                            logger.debug('Kowsik type',ogType);
                        });
                        keys.forEach(function (key) {
                            if (meta[key].attribs && meta[key].attribs.property &&
                                meta[key].attribs.property === 'og:title') {
                                ogTitle = meta[key].attribs.content;
                            }
                        });
                        keys.forEach(function (key) {
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
                    text = text.replace(/\s+/g, ' ')
                        .replace(/[^a-zA-Z ]/g, '')
                        .toLowerCase();
                    logger.debug('created texts for ' + dataObj.url);
                    dataObj.text = text;
                } else {
                    logger.error('[ THIS IS NOT AN ERROR ] sry the url ' + dataObj.url + ' is not responding');
                }
                resolve(dataObj);
            },
            function (err) {
                reject(err);
            });
    });
    return promise;
};
const getResponseToLowerCase = function (dataObj) {
    logger.debug('Iam in getResponseToLowerCase', dataObj.url);
    let promise = new Promise(function (resolve, reject) {
        superAgentRequest.get(dataObj.url).end(function (error, response) {
            logger.debug('getResponseToLowerCase: response ', response);
            // if(!error && response.statusCode === 200) {
            // logger.debug('parseText: ', response.text);
            // let page = cheerio.load(response.text);
            // page = page.replace(/\s+/g, ' ')
            //     .replace(/[^a-zA-Z ]/g, '')
            //     .toLowerCase();
            logger.debug('created texts for ' + dataObj.url);
            dataObj.text = response.text;
            logger.debug('getResponseToLowerCase dataObj: ', dataObj.terms);
            // } else {
            //     logger.error('[ THIS IS NOT AN ERROR ] sry the url '+dataObj.url+' is not responding')
            // }
            resolve(dataObj);

            if (error) {
                reject(error);
            }
        });
    });
    return promise;
};

const extractData = function (data) {
  let promise = new Promise(function (resolve, reject) {
        async.waterfall([
            /* get the DOM MODEL to traverse the web document accordingly */
            async.apply(readFile, data),
            async.asyncify(function (modelObj) {
                modelObj = JSON.parse(modelObj);
                logger.debug('modelObj parsing', modelObj.title);
                logger.debug('Extracting the content from the URL');


                // let txt = keyword_extractor.extract(data.text, {
                //     language: 'english',
                //     remove_digits: true,
                //     return_changed_case: true,
                //     remove_duplicates: false
                // })
                // data.text = txt;

                let type = '';
                logger.debug('txt', data.text);
                logger.debug('testing for url', data.url);
                let termOptimalWeight = 0;
                let terms = [];
                data.interestedTerms.forEach(function (item, index) {
                    let termWeight = createTreeOfWebDocLike(data.text, modelObj, item);

                    logger.debug("termWeight: ", termWeight);
                    logger.debug("Type:text");
                    logger.debug("Interested Terms ", data.interestedTerms[index])
                    logger.debug('termWeight: ', termWeight);
                    logger.debug('Interested Terms ', data.interestedTerms[index]);
                    termOptimalWeight = parseInt(termWeight.maxWeight) + parseInt(termWeight.totalWeight);
                    logger.debug('termOptimalWeight: ', termOptimalWeight);
                    terms.push({
                        word: data.interestedTerms[index],
                        intensity: termOptimalWeight,
                        pathWeights: termWeight.pathWeights,
                        typeOfDoc: type
                    });
                });
                data.terms = terms;

                resolve(data);
            })
        ]);
    });
    return promise;
};

const readFile = function (data, callback) {
    fs.readFile('cypher.json', function (err, data) {
        callback(null, data.toString());
    });
};
const createTreeOfWebDocLike = function (pageResponse, modelObj, needle) {
    logger.debug('createTreeOfWebDocLike: ', modelObj, needle);
    let currentTree = {};
      let parent = {};
      let foundHtml = '';
      let data = {tree: {}, pathWeights: {}};
      let pathWeight = 0;
      let eltNweight = {};
  needle = needle.toLowerCase();
 pageResponse = pageResponse.toLowerCase();
    /*
     iterating the Dom Model and creating your own tree
     */
    function traverseNode(parent, modelObj) {
      let eltName = modelObj.title;
        let foundEltNweight = {};
        let currentNode = {title: modelObj.title, weight: modelObj['child.weight']};
      //  console.log(currentNode);
        /*
         find the needle in the specified  html element
         */
        $ = cheerio.load(pageResponse);
        foundHtml = $(eltName + ':contains(' + needle + ')').text().trim();
        logger.debug('foundHtml: ', foundHtml, 'modelObj:', modelObj);

        if (foundHtml != '') {
            pathWeight = pathWeight + parseInt(currentNode.weight);
            addChild(currentTree, parent, currentNode);
        }

        if (typeof modelObj.child != 'undefined' && typeof modelObj.child == 'object') {
            parent = currentNode;
            Object.keys(modelObj.child).map(function (key, index) {
                return traverseNode(parent, modelObj.child[key]);
            });
        }

        if (typeof modelObj.child == 'undefined' & pathWeight != 0) {
            if (typeof data['pathWeights'][eltName] == 'undefined') {
                data['pathWeights'][eltName] = pathWeight;
            }
        }
        pathWeight = 0;

        data['tree'] = currentTree;
        let weightsArr = [];
        let maxWeight = 0;
        let totalWeight = 0;
        let currentWeight;
        Object.keys(data['pathWeights']).map(function (k) {
            weight = data['pathWeights'][k];
            totalWeight = totalWeight + weight;
            weightsArr.push(weight);
        });
        if (weightsArr.length != 0) {
            maxWeight = Math.max.apply(null, weightsArr);
        }

        /*
         you can return data to check tree formed and nodes found with their relative weight
         return data;
         */

        /* return the path with max weght and the summation of the weight of all the paths*/
        return {maxWeight: maxWeight, totalWeight: totalWeight, pathWeights: data['pathWeights']};
    }

    /*
     traversing the current tree to push the children
     */
    function addChild(currentNode, parent, childnode) {
        // logErr('\n==============================');
        // logErr('\nbefore tree: ' + JSON.stringify(currentTree));
        // logErr('\n********' + '\n' + JSON.stringify(currentNode) + '\n' + JSON.stringify(parent) + '\n' + JSON.stringify(childnode) + '\n' + '********');
        if (Object.keys(currentTree).length === 0) {
            currentTree = childnode;
            // logErr('\n1\n Tree: ' + JSON.stringify(currentTree));
            return;
        }

        /*
         (expected parent node found ? add children and return : go to next depth)
         */
        if (currentNode.title == parent.title) {
            if (typeof currentNode.child == 'undefined') {
                currentNode['children'] = [];
            }
            currentNode['children'].push(childnode);
            // logErr('\n1\n Tree: ' + JSON.stringify(currentTree));
            return;
        }
        if (typeof currentNode.child != 'undefined' && typeof currentNode.child == 'object') {
            Object.keys(currentNode.child).map(function (key, index) {
                addChild(currentNode.child[key], parent, childnode);
            });
        }
        return;
    }

    return traverseNode(parent, modelObj);
};


module.exports = {
    termsFinder: termsFinder,
    indexUrl: indexUrl,
    getIntents: getIntents,
    saveWebDocument: saveWebDocument,
    extractData: extractData,
    createTreeOfWebDocLike: createTreeOfWebDocLike,
    parseText: parseText,
    getResponseToLowerCase: getResponseToLowerCase
};
