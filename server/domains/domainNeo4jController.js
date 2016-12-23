const DomainModel = require('./domainEntity').DomainModel;

const neo4jDriver = require('neo4j-driver').v1;

const logger = require('./../../applogger');

const config = require('./../../config');

let indexNewDomain = function(newDomainObj) {
  let promise = new Promise(function(resolve, reject) {

    logger.debug("Now proceeding to index new domain: ", newDomainObj);
    let driver = neo4jDriver.driver(config.NEO4J_BOLT_URL,
      neo4jDriver.auth.basic(config.NEO4J_USR, config.NEO4J_PWD),{encrypted:false}
      );

    let session = driver.session();

    logger.debug("obtained connection with neo4j");

    let query = 'MERGE (d:Domain {name:{domainName}}) return d';
    let params = {
      domainName: newDomainObj.name
    };

    session.run(query, params)
    .then(function(result) {
      result.records.forEach(function(record) {
        logger.debug("Result from neo4j: ", record);
      });

        // Completed! 
        session.close();
        resolve(newDomainObj);
      })
    .catch(function(err) {
      logger.error("Error in neo4j query: ", err, ' query is: ',
        query);
      reject(err);
    });
  });

  return promise;
}

let getAllDomainConcept = function(domainNameColln) {
  let promise = new Promise(function(resolve, reject) {

    logger.debug("Now proceeding to retrive the concepts for all domains: ");
    let driver = neo4jDriver.driver(config.NEO4J_BOLT_URL,
      neo4jDriver.auth.basic(config.NEO4J_USR, config.NEO4J_PWD),{encrypted:false}
      );

    let session = driver.session();

    logger.debug("obtained connection with neo4j");
    let data=[];
    
    domainNameColln.forEach(function(domainName){

      let query = 'MATCH (d:Domain{name:{domainName}}) match(c:Concept) match(d)<-[r:ConceptOf]-(c)  RETURN d,count(c)';

      let params = {
        domainName: domainName
      };


      session.run(query,params)
      .then(function(result) {
        result.records.forEach(function(record) {

          let obj={
            Domain:"",
            noOfConcepts:0
          }
          record._fields.forEach(function(field){
            if(field.low===undefined)
            {
              obj.Domain=field.properties.name;
            }
            else
            {
              obj.noOfConcepts=field.low
            }
          });   
          data.push(obj);
        }); 
        if(data.length===domainNameColln.length)
          resolve(data);    
      }).catch(function(err) {
        logger.error("Error in neo4j query: ", err, ' query is: ',
          query);
        reject(err);
      });

    })

   // resolve(data);
   
 });

  return promise;
}


let getDomainConcept = function(domainName) {
  let promise = new Promise(function(resolve, reject) {

    logger.debug("Now proceeding to retrive the concepts for domain name: ", domainName);
    let driver = neo4jDriver.driver(config.NEO4J_BOLT_URL,
      neo4jDriver.auth.basic(config.NEO4J_USR, config.NEO4J_PWD),{encrypted:false}
      );

    let session = driver.session();

    logger.debug("obtained connection with neo4j");

    let query = 'MATCH (d:Domain{name:{domainName}}) match(c:Concept) match(d)<-[r:ConceptOf]-(c) RETURN c';
    let params = {
      domainName: domainName
    };
    let concepts=[];
    session.run(query, params)
    .then(function(result) {
      result.records.forEach(function(record) {
        record._fields.forEach(function(fields){
          concepts.push(fields.properties.name);
        });        

      });
      
        // Completed! 
        session.close();
        resolve({Domain:domainName,Concepts:concepts});
      })
    .catch(function(err) {
      logger.error("Error in neo4j query: ", err, ' query is: ',
        query);
      reject(err);
    });
  });

  return promise;
}

let indexNewDomainCallBack = function(newDomainObj, callback) {
  indexNewDomain(newDomainObj).then(function(indexedDomainObj) {
    callback(null, indexedDomainObj);
  }, function(err) {
    callback(err, null);
  });
}
let getDomainConceptCallback = function(domainName, callback) {
  getDomainConcept(domainName).then(function(retrievedDomainConcept) {
    callback(null, retrievedDomainConcept);
  }, function(err) {
    callback(err, null);
  });
}
let getAllDomainConceptCallback = function(domainNameColln, callback) {
  getAllDomainConcept(domainNameColln).then(function(retrievedAllDomainConcept) {
    callback(null, retrievedAllDomainConcept);
  }, function(err) {
    callback(err, null);
  });
}

module.exports = {
  indexNewDomain: indexNewDomain,
  getDomainConcept:getDomainConcept,
  getAllDomainConcept:getAllDomainConcept,
  indexNewDomainCallBack: indexNewDomainCallBack,
  getDomainConceptCallback: getDomainConceptCallback,
  getAllDomainConceptCallback: getAllDomainConceptCallback
}
