const neo4jDriver = require('neo4j-driver').v1;
const logger = require('./../../applogger');
const config = require('./../../config');

let driver = neo4jDriver.driver(config.NEO4J_BOLT_URL,
  neo4jDriver.auth.basic(config.NEO4J_USR, config.NEO4J_PWD),{encrypted:false});

let getTerms = function(data) {
  let promise = new Promise(function(resolve, reject) {
    logger.debug("Now proceeding to get all terms of domain: ", data.domain);

    let query = 'MATCH(d:'+config.NEO4J_DOMAIN+')<-[]-(i:'+config.NEO4J_INTENT+')<-[]-(t:'
    +config.NEO4J_TERM+') where d.name={name} return t';

    let params = {
      name: data.domain
    };
    let terms=[];
    let session = driver.session();
    session.run(query, params)
    .then(function(result) {
      result.records.forEach(function(record) {
        record._fields.forEach(function(fields){
          terms.push(fields.properties.name);
        });
      });
        // Completed!

        session.close();
        logger.debug("Result from neo4j: ", terms);
        data.interestedTerms=terms
        resolve(data);
      })
    .catch(function(err){
      logger.error("Error in neo4j query: ", err, ' query is: ',
        query);
      reject(err);
    })
  });

  return promise;
  //return 10;
}

let getUrlIndexed = function(data) {
  let promise = new Promise(function(resolve, reject) {

    logger.debug("Now proceeding to index url to domain: ", data.concept);

    let session = driver.session();

    let intents=[];

    logger.debug("obtained connection with neo4j");

    let query = 'Match (d:'+config.NEO4J_DOMAIN+'{name:{domainName}})  Match (c:'
    +config.NEO4J_CONCEPT+'{name:{conceptName}}) Match (i:'
    +config.NEO4J_INTENT+') MERGE(c)<-[r:'+config.NEO4J_DOC_REL
    +']-(u:'+config.NEO4J_WEBDOCUMENT+'{name:{urlName}}) return i';
    let params = {
      domainName: data.domain,
      conceptName: data.concept,
      urlName: data.url
    };
    session.run(query , params)
    .then(function(result) {
      result.records.forEach(function(record) {
        logger.debug("Result for terms from neo4j: ", record);
        intents.push(record._fields[0].properties.name);

      });

        // Completed!

        session.close();
        resolve({data:data,intents:intents});
      })
    .catch(function(err) {
      logger.error("Error in neo4j query: ", err, ' query is: ',
        query);
      reject(err);
    });
  });

  return promise;
}

module.exports = {
  getTerms: getTerms,
  getUrlIndexed:getUrlIndexed
}
