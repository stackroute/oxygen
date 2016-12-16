'use strict';
const domainNeo4jController = require('./domainNeo4jController');
const domainMongoController = require('./domainMongoController');

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

module.exports = {
  publishNewDomain: publishNewDomain
}
