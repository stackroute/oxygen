'use strict';
const domainNeo4jController = require('./domainNeo4jController');
const domainMongoController = require('./domainMongoController');
const domainMgr = require('./domainManager');

const logger = require('./../../applogger');

const DOMAIN_NAME_MIN_LENGTH = 3;

let publishNewDomain = function(newDomainObj) {
  logger.debug("Received request for saving new domain: ", newDomainObj);
  //Save to Mongo DB
  //Save to Neo4j

  let promise = new Promise(function(resolve, reject) {

    if (!newDomainObj.name ||
      newDomainObj.name.length <= DOMAIN_NAME_MIN_LENGTH) {
      reject({
        error: "Invalid domain name..!"
      });
  }

  domainMongoController.saveNewDomain(newDomainObj)
  .then(
    function(savedDomainObj) {
      logger.debug("Successfully saved domain in Mongo ",
        savedDomainObj);
      domainNeo4jController.indexNewDomain(savedDomainObj)
      .then(
        function(indexedDomainObj) {
          logger.debug("Successfully indexed domain ",
            indexedDomainObj);

                // Manually push this execution to background
                process.nextTick(function() {
                  logger.debug("initialising New Domain ",
                    savedDomainObj);

                  // Initilise the ontology for the domain
                  domainMgr.initialiseDomainOntology(savedDomainObj.name)
                  .then(function(domainName) {
                    logger.info(
                      'Done initialising ontologies for new Domain ',
                      domainName);

                    domainMgr.buildDomainIndex(domainName)
                    .then(function(result) {
                      logger.info('Done indexing domain: ',
                        domainName, ' result: ', result);
                    },
                    function(err) {
                      logger.error(
                        'Error in building domain index ',
                        err);
                            }); //end of buildDomainIndex
                  },
                  function(err) {
                    logger.error(
                      'Error in initializing domain ontology, error: ',
                      err);
                      }); //end of initialiseDomainOntology
                }); //end of nextTick

                resolve(indexedDomainObj);
              },
              function(err) {
                logger.error("Encountered error in indexing new domain: ",
                  err);
                reject(err);
              }
              );
    },
    function(err) {
      logger.error(
        "Encountered error in saving new Domain Object in mongo..!"
        );
      reject(err);
    })
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

  domainMongoController.checkDomain(domainName)
  .then(
    function(checkedDomain) {
      logger.debug("Successfully verified domain in Mongo of name",
        checkedDomain);
      domainNeo4jController.getDomainConcept(checkedDomain.name)
      .then(
        function(retrivedDomainConcepts) {
          logger.debug("Successfully retrived concept(s) from  domain ",
            retrivedDomainConcepts);

                // Manually push this execution to background
                process.nextTick(function() {
                  logger.debug("retrivedDomainConcepts ",
                    retrivedDomainConcepts);

                }); //end of nextTick

                resolve(retrivedDomainConcepts);
              },
              function(err) {
                logger.error("Encountered error in retriving concept(s) in domain: ",
                  err);
                reject(err);
              }
              );
    },
    function(err) {
      logger.error(
        "Encountered error in checking the domain in mongo..!"
        );
      reject(err);
    })
});

  return promise;
}

module.exports = {
  publishNewDomain: publishNewDomain,
  getDomain:getDomain
}
