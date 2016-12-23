const domainNeo4jController = require('./domainNeo4jController');
const docSearchJobMgr = require('../docSearchJob/docSearchJobManager');

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
  let promise = new Promise(function(resolve, reject) {
   // Fetch all domain concepts and intents
   domainNeo4jController.getDomainConcept(domainName)
   .then(function(conceptsColln) {
    logger.debug('@@ OVER++++++++++++++++++++++');
     resolve(conceptsColln);
    docSearchJobMgr.kickOffDomainIndexing(conceptsColln)
    .then(function(result) {
        resolve(conceptsColln);
    }, function(err) {
      reject(err);
    });
  }, function(err) {
    reject(err);
  });
 });

  return promise;
}

let buildDomainIndexCallBack = function(domainName, callback) {
  buildDomainIndex(domainName)
  .then(function(result) {
    callback(null, result);
  }, function(err) {
    callback(err, null);
  });
}

let initialiseDomainOntologyCallBack = function(domainName, callback) {
  initialiseDomainOntology(domainName)
  .then(function(result) {
    callback(null, result);
  }, function(err) {
    callback(err, null);
  });
}

module.exports = {
  initialiseDomainOntology: initialiseDomainOntology,
  initialiseDomainOntologyCallBack: initialiseDomainOntologyCallBack,
  buildDomainIndex: buildDomainIndex,
  buildDomainIndexCallBack: buildDomainIndexCallBack
}
