const domainNeo4jController = require('./domainNeo4jController');

const neo4jDriver = require('neo4j-driver').v1;

const logger = require('./../../applogger');
const config = require('./../../config');

let initialiseDomainOntology = function(domainName) {
  //Create Default Domain concepts and intents
  //call  buildDomainIndex
  let promise = new Promise(function(resolve, reject) {

    logger.debug('now initialising new domain: ', domainName);


    let driver = neo4jDriver.driver(config.NEO4J_BOLT_URL,
      neo4jDriver.auth.basic(config.NEO4J_USR, config.NEO4J_PWD),{encrypted:false}
      );

    let session = driver.session();

    logger.debug('[*] [domainManager] obtained neo4j connection ');

    let query = '';
    query += 'MATCH (d:Domain {name:{domainName}}) ';
    query += 'WITH d ';
    query += 'MERGE (c:Concept {name:{conceptName}}) ';
    query += 'MERGE (i:Intent {name:{intentName}}) ';
    query += 'MERGE (ti:Term {name:{indicatorTerm}}) ';
    query += 'MERGE (cti:Term {name:{counterIndicatorTerm}}) ';
    query += 'MERGE (c)-[cr:ConceptOf]->(d) ';
    query += 'MERGE (i)-[ir:IntentOf]->(d) ';
    query += 'MERGE (ti)-[tir:IndicatorOf]->(i) ';
    query += 'MERGE (cti)-[ctir:CounterIndicatorOf]->(i) ';
    query += 'return c,i,d,ti,cti,cr,ir,tir,ctir';

    const defaultConceptName = domainName;
    const defaultIntentName = 'introduction';
    const defaultIndicatorTerm = defaultIntentName;
    const defaultCounterIndicatorTerm = 'advanced';

    let params = {
      domainName: domainName,
      conceptName: domainName,
      intentName: defaultIntentName,
      indicatorTerm: defaultIndicatorTerm,
      counterIndicatorTerm: defaultCounterIndicatorTerm
    };

    session.run(query, params)
    .then(function(result) {
      result.records.forEach(function(record) {
        logger.debug('[*] [domainManager] Result from neo4j: ',
          record);
      });
      
        // Completed! 
        session.close();
        resolve(domainName);
      })
    
    .catch(function(err) {
      logger.error(
        'Error in neo4j query for initialising domain with defaults: ',
        err, ' query is: ',
        query, ' params are: ', params);
      reject(err);
    });
  });

  return promise;
}


// Along with domain, specify exact concept(s) and intent(s)
let buildDomainIndex = function(domainName) {
  // Fetch all domain concepts and intents
  // Kick off search jobs for each concept 

  let promise = new Promise(function(resolve, reject) {
    resolve({});
  });

  return promise;
}

module.exports = {
  initialiseDomainOntology: initialiseDomainOntology,
  buildDomainIndex: buildDomainIndex
}
