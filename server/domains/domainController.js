'use strict';
const domainNeo4jController = require('./domainNeo4jController');
const domainMongoController = require('./domainMongoController');
const domainMgr = require('./domainManager');
const startCrawlerMQ = require('./../searcher/docOpenCrawlerEngine').startCrawler;
const startFnGen = require('./domainEngine').startDomainEngine;
const logger = require('./../../applogger');

const async = require('async');

const DOMAIN_NAME_MIN_LENGTH = 3;

let insertUrls = function(dataToInsert) {
    console.log(dataToInsert)
    try {
        dataToInsert.data.concepts.forEach(function(concept) {
            concept.urls.forEach(function(url) {

                let msgObj = {
                    domain: dataToInsert.domainName,
                    concept: concept.name,
                    url: url

                };
                console.log(msgObj)
                startCrawlerMQ(msgObj);


            })
        })
        return {
            msg: "manually added urls successfully "
        }
    } catch (err) {

        return {
            msg: "error while manually adding",
            err: err
        }
    }
}
let fetchDomainCardDetails = function(domain) {
    logger.debug("Received request for retriving domain details ", domain);
    //Save to Mongo DB
    //Save to Neo4j

    let promise = new Promise(function(resolve, reject) {

        async.waterfall([
                function(callback) {
                    //  logger.debug("inside the waterfall " + domain)
                    domainNeo4jController.getDomainCardDetailsCallback(domain,
                        callback);
                }
            ],
            function(err, domainObjDetails) {
                if (err) {
                    reject(err);
                }
                resolve(domainObjDetails);
            }); //end of async.waterfall
    });

    return promise;
}


// This should be private and not exposed
let indexPublishedDomain = function(domainName) {
    //process.nextTick(function() {
    let promise = new Promise(
        function(resolve, reject) {

            logger.debug('Off-line initialising New Domain ', domainName);

            async.waterfall([
                    function(callback) {
                        domainMgr.initialiseDomainOntologyCallBack(domainName,
                            callback);
                    },
                    function(initialisedDomainName, callback) {
                        resolve(initialisedDomainName);
                        domainMgr.buildDomainIndexCallBack(initialisedDomainName,
                            callback);
                    }
                ],
                function(err, result) {
                    logger.debug(
                        'indexPublishedDomain process finished with error: ', err,
                        ' result: ', result);

                    let status = 'error';
                    let statusText = 'unknown error';

                    if (err) {
                        status = 'error';
                        statusText =
                            'Error in off-line indexing process of newly published Domain ' +
                            domainName + ' err: ' + JSON.stringify(err);
                        logger.error(statusText);
                        reject(err);
                    } else {
                        status = 'ready';
                        statusText = 'Done indexing newly published domain ' +
                            domainName + ' with result ' + JSON.stringify(result);

                        logger.debug(statusText);
                    }
                    logger.debug('Updating domain status ', status, ' | ',
                        statusText);

                    domainMongoController.updateDomainStatus(domainName, status,
                        statusText,
                        function(updErr, updatedDomainObj) {

                            if (updErr) {
                                logger.error('Error in updating domain status for ',
                                    domainName,
                                    ' trying to update status to ', status, ' with ',
                                    statusText);
                                return;
                            }

                            if (!updatedDomainObj) {
                                logger.error(
                                    'Found null domain object for updating status for ',
                                    domainName,
                                    ' trying to update status to ', status, ' with ',
                                    statusText);
                                return;
                            }
                            if (updErr) {
                                reject(updErr);
                            }
                            logger.debug(
                                'Done updating domain with Indexing Status for domain ',
                                domainName, ' with status ',
                                status);
                        }); //end of updateDomainStatus
                });
        });
    return promise;
}

let publishNewDomain = function(newDomainObj) {
    logger.debug('Received request for saving new domain: ', newDomainObj);
    //Save to Mongo DB
    //Save to Neo4j

    let promise = new Promise(function(resolve, reject) {
        if (!newDomainObj.name ||
            newDomainObj.name.length <= DOMAIN_NAME_MIN_LENGTH) {
            reject({
                error: 'Invalid domain name..!'
            });
        }

        async.waterfall([function(callback) {
                    domainMongoController.saveNewDomainCallBack(newDomainObj,
                        callback);
                },
                function(savedDomainObj, callback) {
                    logger.debug('Got saved domain object for indexing: ',
                        savedDomainObj);
                    domainNeo4jController.indexNewDomainCallBack(savedDomainObj,
                        callback)
                }
            ],
            function(err, indexedDomainObj) {
                if (err) {
                    logger.error("Error in publishNewDomain : ", err)
                    reject(err);
                }
                if (indexedDomainObj) {
                    //Kick off indexing in off-line,
                    //so the API request is not blocked till indexing is complete,
                    // as it may take long time to complete
                    indexPublishedDomain(indexedDomainObj.name).then(
                            function(domainObj) {
                                logger.debug("going to fetch domain card details: ",
                                    domainObj);
                                fetchDomainCardDetails(domainObj)
                                    .then(function(domainObjRes) {
                                            logger.debug(
                                                "Successfully fetched domain card details: ",
                                                domainObjRes);
                                            domainObjRes.name = indexedDomainObj.name;
                                            domainObjRes.description = indexedDomainObj.description;
                                            domainObjRes.domainImgURL = indexedDomainObj.domainImgURL;
                                            logger.debug("going to UI ", domainObjRes);
                                            resolve(domainObjRes);
                                            return;
                                        },
                                        function(fetchErr) {
                                            logger.error(
                                                "Encountered error in fetching domain card details: ",
                                                fetchErr);
                                            reject(fetchErr);
                                            return;
                                        });

                            })
                        .catch(
                            function(reason) {
                                console.log('Handle rejected promise (' + reason +
                                    ') here.');
                                reject(indexedDomainObj)
                            });



                } else {
                    reject({
                        error: 'Null indexed object was returned..!'
                    });
                }
            }); //end of async.waterfall
    });

    return promise;
}



let getDomain = function(domainName) {
    logger.debug("Received request for retriving Concept(s) in domain: ",
        domainName);
    //Save to Mongo DB
    //Save to Neo4j

    let promise = new Promise(function(resolve, reject) {




        async.waterfall([function(callback) {
                    domainMongoController.checkDomainCallback(domainName,
                        callback);
                },
                function(checkedDomain, callback) {

                    domainNeo4jController.getDomainConceptWithDocCallback(
                        checkedDomain.name,
                        callback)
                },
                function(checkedDomainWithConcepts, callback) {

                    domainNeo4jController.getDomainIntentCallback(
                        checkedDomainWithConcepts,
                        callback)
                }
            ],
            function(err, retrivedDomainConceptsAndIntents) {
                if (err) {
                    reject(err);
                }
                resolve(retrivedDomainConceptsAndIntents);
            }); //end of async.waterfall
    });
    return promise;
}




let getAllDomainDetails = function() {

    logger.debug("Received request for retriving Concept(s) of all domain: ");

    let promise = new Promise(function(resolve, reject) {
        let cardDetailsObj = [];
        async.waterfall([function(callback) {
                    domainMongoController.getAllDomainsCallback(callback);
                },
                function(domainDetailedColln, callback) {
                    if (domainDetailedColln.length === 0) {
                        callback(null, cardDetailsObj);
                    } else {
                        for (let item in domainDetailedColln) {
                            if (Object.prototype.hasOwnProperty.call(
                                    domainDetailedColln, item)) {
                                logger.debug("returned from mongo ",
                                    domainDetailedColln.length);
                                let domain = domainDetailedColln[item];
                                fetchDomainCardDetails(domain.name)
                                    .then(function(domainObj) {
                                            logger.debug(
                                                "Successfully fetched domain card details from mongo: ",
                                                domainObj);
                                            domainObj.name = domain.name;
                                            domainObj.description = domain.description;
                                            domainObj.domainImgURL = domain.domainImgURL;
                                            cardDetailsObj.push(domainObj)
                                                // logger.debug("after each pushing", cardDetailsObj);
                                            if (cardDetailsObj.length === domainDetailedColln
                                                .length) {
                                                callback(null, cardDetailsObj);
                                            }
                                        },
                                        function(err) {
                                            logger.error(
                                                "Encountered error in fetching domain card details: ",
                                                err);
                                            reject(err);
                                            return;
                                        });
                            }
                        }
                        logger.debug("cardData populated", cardDetailsObj);
                    }
                }
            ],
            function(err, finalCardDetailsObj) {
                //logger.debug("inside callback", finalCardDetailsObj);
                if (err) {
                    reject(err);
                }

                if (finalCardDetailsObj) {
                    logger.debug(" now sending back card details", finalCardDetailsObj);
                    resolve(finalCardDetailsObj);
                } else {
                    reject({
                        error: 'all domains not fetched!'
                    });
                }
            }
        ); //end of async.waterfall
    });
    return promise;
}

let freshlyIndexDomain = function(domain) {
    logger.debug("Received request for freshly indexing a domain ", domain);

    let promise = new Promise(function(resolve, reject) {

        if (!domain ||
            domain.length <= DOMAIN_NAME_MIN_LENGTH) {
            reject({
                error: "Invalid domain name..!"
            });
        }

        async.waterfall([
                function(callback) {
                    logger.debug("inside the waterfall for freshly indexing" +
                        domain)
                    domainMgr.buildDomainIndexCallBack(domain,
                        callback);
                }
            ],
            function(err, domainObjDetails) {
                if (err) {
                    reject(err);
                }
                resolve(domainObjDetails);
            }); //end of async.waterfall
    });

    return promise;
}

let fetchWebDocuments = function(domainObj) {
    logger.debug("Received request for fetching Webdocuments ", domainObj);
    let docsDetails = [];
    let promise = new Promise(function(resolve, reject) {



        async.waterfall([
                function(callback) {
                    logger.debug("inside the waterfall for fetching web docs" +
                        domainObj)
                    domainNeo4jController.getWebDocumentsCallback(domainObj,
                        callback);
                },
                function(docs, callback) {
                    if (docs.length === 0) {
                        callback(null, docsDetails);
                    } else {
                        let abc = [];
                        for (let item in docs) {
                            if (Object.prototype.hasOwnProperty.call(docs, item)) {
                                // logger.debug("going to neo4J ", docs.length);
                                let url = docs[item].url;
                                logger.debug("going to neo4J ", url);
                                domainNeo4jController.getIntentforDocument({
                                        domainObj: domainObj,
                                        docs: url
                                    })
                                    .then(function(intentObj) {
                                            docs[item].intentObj = intentObj;
                                            abc.push('hi');
                                            // logger.debug("url--> ", url);
                                            // logger.debug("after each pushing of intents*****",
                                            //  docs[item].intentObj);
                                            if (abc.length === docs.length) {
                                                callback(null, docs);
                                            }
                                        },
                                        function(err) {
                                            logger.error(
                                                "Encountered error in fetching doc intentObj details: ",
                                                err);
                                            reject(err);
                                            return;
                                        });
                            }
                        }
                    }
                },
                function(docs, callback) {
                    if (docs.length === 0) {
                        callback(null, docsDetails);
                    } else {
                        for (let item in docs) {
                            if (Object.prototype.hasOwnProperty.call(docs, item)) {
                                logger.debug("going to mongo ", docs.length);
                                let url = docs[item].url;
                                logger.debug("going to mongo url ", url);
                                domainMongoController.getSearchResultDocument(url)
                                    .then(function(docObj) {
                                            //  logger.debug(
                                            //   "Successfully fetched doc details from mongo *****: ",
                                            //    docObj);
                                            docsDetails.push({
                                                title: docObj.title,
                                                description: docObj.description,
                                                url: docObj.url,
                                                intensity: docs[item].intensity,
                                                intentObj: docs[item].intentObj
                                            })

                                            //  logger.debug("after each pushing", docsDetails);
                                            if (docsDetails.length === docs.length) {
                                                callback(null, docsDetails);
                                            }
                                        },
                                        function(err) {
                                            logger.error(
                                                "Encountered error in fetching doc details: ",
                                                err);
                                            reject(err);
                                            return;
                                        });
                            }
                        }
                        // logger.debug("pushing ended", docsDetails);
                    }
                }
            ],
            function(err, docObjDetails) {
                if (err) {
                    reject(err);
                }
                resolve(docObjDetails);
            }); //end of async.waterfall
    });

    return promise;
}

let getAllDomain = function() {

    logger.debug("Received request for retriving all domain: ");


    let promise = new Promise(function(resolve, reject) {

        async.waterfall([function(callback) {
                domainMongoController.getAllDomainsCallback(callback);
            }],
            function(err, domainColln) {
                logger.debug("got the domain collection", domainColln)
                if (!err) {
                    resolve(domainColln)
                }
                reject(err)
            }); //end of async.waterfall
    });
    return promise;
}

let getTreeOfDomain = function(domain) {
  logger.debug('domain ctrl',domain);
    logger.debug("Received request for retriving domain details ", domain.name);
    //Save to Mongo DB
    //Save to Neo4j

    let promise = new Promise(function(resolve, reject) {
        async.waterfall([
                function(callback) {
                     logger.debug("inside the waterfall " + domain)
                    domainNeo4jController.getTreeOfDomainCallback(domain,
                        callback);
                }
            ],
           function(err, tree) {
                logger.debug("got the domain collection", domain)
                if (!err) {
                    resolve(tree)
                }
                reject(err)
            });//end of async.waterfall
    });

    return promise;
}

let deleteDomain =function(domain){
    logger.debug('domain ctrl',domain);
    logger.debug("Received request for deleting domain",domain.domainName);

    let promise = new Promise(function(resolve,reject){
            async.waterfall([
                     function(callback){
                         logger.debug("inside waterfall::mongodelete", domain)
                        domainMongoController.deleteDomain(domain,callback);
                     },

                     function(deletedDomain, callback){
                         logger.debug("inside waterfall::neo4jdelete", deletedDomain)
                        domainNeo4jController.deleteDomainCallback(domain, callback);
                    }
                ],
                function(err,tree){
                    if(err){
                        reject(err);
                    }

                    resolve(domain);
                });
    });
    return promise;
}

/*
test function generation
 */

let testFnGen = function(data){
    console.log('testFnGen: data ',data);
    try{

        startFnGen();
        return {
            msg: "Test function generation was successful"
        }
    } catch (err){
        return {
            msg: 'Error: test Function wasn not generated successfully',
            err: err
        }
    }
}

module.exports = {
    publishNewDomain: publishNewDomain,
    getDomain: getDomain,
    insertUrls: insertUrls,
    fetchDomainCardDetails: fetchDomainCardDetails,
    getAllDomainDetails: getAllDomainDetails,
    freshlyIndexDomain: freshlyIndexDomain,
    fetchWebDocuments: fetchWebDocuments,
    getAllDomain: getAllDomain,
    getTreeOfDomain: getTreeOfDomain,
    deleteDomain:deleteDomain
}
