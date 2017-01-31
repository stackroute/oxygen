const neo4jDriver = require('neo4j-driver').v1;

const logger = require('./../../applogger');

const config = require('./../../config');
const graphConsts = require('./../common/graphConstants');

let getPublishIntent = function(domainObj) {
   let domainName=domainObj.domain;
   let intentName=domainObj.intent;
   logger.debug(domainName);
   let promise = new Promise(function(resolve, reject) {
       logger.debug(
           "Now proceeding to publish the concepts for domain name: ",
           domainName);
       let driver = neo4jDriver.driver(config.NEO4J.neo4jURL,
           neo4jDriver.auth.basic(config.NEO4J.usr, config.NEO4J.pwd), {
               encrypted: false
           }
       );

       let session = driver.session();

       logger.debug("obtained connection with neo4j");

       let query = 'merge (c:' + graphConsts.NODE_INTENT + '{name:{intentName}})'
       query += 'merge(d:' + graphConsts.NODE_DOMAIN + '{name:{domainName}})'
       query += 'merge(c)-[r:' + graphConsts.REL_INTENT_OF + ']->(d)'

       let params={
         intentName: intentName,
         domainName: domainName
       };

       session.run(query,params).then(function(result) {
               if (result) {
                   logger.debug(result);
               }
               session.close();
               resolve(intentName);
           })
           .catch(function(error) {
               logger.error("Error in NODE_CONCEPT query: ", error, ' query is: ', query);
               reject(error);
           });
   });
   return promise;
};

let getPublishIntentCallback = function(domainObj, callback) {
   logger.debug("from the callback : " +domainObj.domain);
   getPublishIntent(domainObj).then(function(intentDetails) {
       callback(null, intentDetails);
   }, function(err) {
       callback(err, null);
   });
};

module.exports = {
   getPublishIntentCallback: getPublishIntentCallback
};
