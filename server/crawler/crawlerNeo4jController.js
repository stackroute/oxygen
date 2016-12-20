const DomainModel = require('./../domains/domainEntity').DomainModel;

const neo4jDriver = require('neo4j-driver').v1;

const logger = require('./../../applogger');

const config = require('./../../config');

let driver = neo4jDriver.driver(config.NEO4J_BOLT_URL,
  neo4jDriver.auth.basic(config.NEO4J_USR, config.NEO4J_PWD),{encrypted:false}
  );

let getTerms = function(data) {
  let promise = new Promise(function(resolve, reject) {

    logger.debug("Now proceeding to get all terms of domain: ", data.domain);
    
    let intrestedTermsArr = [];
    let session = driver.session();

    logger.debug("obtained connection with neo4j");

    let query = 'MATCH(d:domain)-[]-(t:terms) where d.name={name} return t';
    let params = {
      name: data.domain.name
    };
    session.run(query , params)
    .then(function(result) {
      result.records.forEach(function(record) {
        logger.debug("Result from neo4j: ", record);
        intrestedTermsArr.push(record._fields[0].properties.name)
      });
      data.intrestedTerms = intrestedTermsArr;
        // Completed! 
        session.close();
        resolve(data);
      })
    .catch(function(err) {
      logger.error("Error in neo4j query: ", err, ' query is: ',
        query);
      reject(err);
    });
  });

  return promise;
}
let getUrlIndexed = function(data) {
  let promise = new Promise(function(resolve, reject) {

    logger.debug("Now proceeding to index url to domain: ", newDomainObj);
    
    
    
    let session = driver.session();

    logger.debug("obtained connection with neo4j");

    let query = 'MERGE(d:domain)<-[r:has_explanationOf]-(u:webDocument) where d.name={domainName} , u.name={urlName} return t';
    let params = {
      domainName: data.domain.name,
      urlName: data.url.name
    };
    session.run(query , params)
    .then(function(result) {
      result.records.forEach(function(record) {
        logger.debug("Result from neo4j: ", record);
        
      });
      
        // Completed! 
        session.close();
        resolve(data);
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
