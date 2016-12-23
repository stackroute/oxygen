'use strict';
const domainNeo4jController = require('./domainNeo4jController');
const domainMongoController = require('./domainMongoController');
const domainMgr = require('./domainManager');

const logger = require('./../../applogger');

const async = require('async');

const DOMAIN_NAME_MIN_LENGTH = 3;

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
    domainNeo4jController.indexNewDomainCallBack(savedDomainObj,
      callback)
  }
  ],
  function(err, indexedDomainObj) {
    if (err) {
      reject(err);
    }
    if (indexedDomainObj) {
          //Kick off indexing in off-line, so the API request is not blocked till indexing is complete, as it may take long time to complete


          indexPublishedDomain(indexedDomainObj.name).then(
            function(domainObj) {
             logger.debug("going to fetch domain card details: ",
               domainObj);
             fetchDomainCardDetails(domainObj)
             .then(function(domainObj) {
               logger.debug("Successfully fetched domain card details: ",
                 domainObj);
               domainObj['name']= indexedDomainObj.name;
               domainObj['description']= indexedDomainObj.description;
               domainObj['domainImgURL']= indexedDomainObj.domainImgURL;
               logger.debug("!!!!!!!!!!!!^^^^^^^^^^^going to UI ",domainObj);
               resolve(domainObj);
               return;
             },
             function(err) {
               logger.error("Encountered error in fetching domain card details: ",
                 err);
               reject(err);
               return;
             });

           })
          .catch(
            function(reason) {
              console.log('Handle rejected promise ('+reason+') here.');
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

// This should be private and not exposed
let indexPublishedDomain = function(domainName) {
  //process.nextTick(function() {
    var promise = new Promise(
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

                logger.debug(
                  'Done updating domain with Indexing Status for domain ',
                  domainName, ' with status ',
                  status);

          }); //end of updateDomainStatus


          });


      });
    return promise;
  }

  let getDomain = function(domainName) {
    logger.debug("Received request for retriving Concept(s) in domain: ", domainName);
  //Save to Mongo DB
  //Save to Neo4j

  let promise = new Promise(function(resolve, reject) {

    if (!domainName ||
      domainName.length <= DOMAIN_NAME_MIN_LENGTH) {
      reject({
        error: "Invalid domain name..!"
      });
  }

  async.waterfall([function(callback) {
    domainMongoController.checkDomainCallback(domainName,
      callback);
  },
  function(checkedDomain, callback) {

    domainNeo4jController.getDomainConceptCallback(checkedDomain.name,
      callback)
  },
  function(checkedDomainWithConcepts, callback) {

    domainNeo4jController.getDomainIntentCallback(checkedDomainWithConcepts,
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



let fetchDomainCardDetails = function(domain) {
  logger.debug("Received request for retriving domain details ", domain);
  //Save to Mongo DB
  //Save to Neo4j

  let promise = new Promise(function(resolve, reject) {


    if (!domain ||
      domain.length <= DOMAIN_NAME_MIN_LENGTH) {
      reject({
        error: "Invalid domain name..!"
      });
  }

  async.waterfall([
    function(callback) {
      logger.debug("inside the waterfall "+domain)
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


module.exports = {
  publishNewDomain: publishNewDomain,
  getDomain:getDomain,
  fetchDomainCardDetails:fetchDomainCardDetails
}
