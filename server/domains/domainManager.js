const domainNeo4jController = require('./domainNeo4jController');

const neo4jDriver = require('neo4j-driver').v1;

const logger = require('./../../applogger');

let initialiseNewDomain = function(domainName) {
  //Create Default Domain concepts and intents
  //call  buildDomainIndex
  let promise = new Promise(function(resolve, reject) {

    logger.debug('now initialising new domain: ', domainName);

    let driver = neo4jDriver.driver(('bolt://localhost'),
      neo4jDriver.auth.basic('neo4j', 'bala')
      ,{encrypted:false});
    let session = driver.session();

    logger.debug("[*] [domainManager] obtained neo4j connection ");

    let query = '';
    query += 'MATCH (d:Domain {name:{domainName}}) ';
    query += 'WITH d ';
    query += 'MERGE (c:Concept {name:{conceptName}}) ';
    query += 'MERGE (i:Intent {name:{intentName}}) ';
    query += 'MERGE (c)-[cr:ConceptOf]->(d) ';
    query += 'MERGE (i)-[ir:IntentOf]->(d) ';
    query += 'return c,i,d,cr,ir';

    defaultIntentName = 'introduction';

    let params = {
      domainName: domainName,
      conceptName: domainName,
      intentName: defaultIntentName
    };

    session.run(query, params)
    .then(function(result) {
      result.records.forEach(function(record) {
        logger.debug("[*] [domainManager] Result from neo4j: ",
          record);
      });

        // Completed! 
        session.close();
        // buildDomainIndex(domainName, domainName, defaultIntentName);
        resolve(domainName);
      })
    .catch(function(err) {
      logger.error(
        "Error in neo4j query for initialising domain with defaults: ",
        err, ' query is: ',
        query);
      reject(err);
    });
  });

  /*logger.debug('initialising the domain: ', domainName);
    setTimeout(function() {
      logger.debug('Done initialising the domain: ', domainName);
    }, 20000);*/

    return promise;
  }

// Only mention domain name
let buildIndexForDomain = function(domainName) {
  // Fetch all domain concepts and intents
  // Kick off search jobs for each concept 
}

// Along with domain, specify exact concept(s) and intent(s)
let buildDomainIndex = function(domainName, concepts, intents) {
  // Fetch all domain concepts and intents
  // Kick off search jobs for each concept 
}

module.exports = {
  initialiseNewDomain: initialiseNewDomain,
  buildIndexForDomain: buildIndexForDomain,
  buildDomainIndex: buildDomainIndex
}
