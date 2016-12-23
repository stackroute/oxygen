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
        logger.debug("just domain saved in neo4j.........@@@@....only name of domain going to do rest ");
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

let getDomainIntent = function(domain) {
  let promise = new Promise(function(resolve, reject) {

    logger.debug("Now proceeding to retrive the intent for domain name: ", domain.Domain);
    let driver = neo4jDriver.driver(config.NEO4J_BOLT_URL,
      neo4jDriver.auth.basic(config.NEO4J_USR, config.NEO4J_PWD),{encrypted:false}
      );

    let session = driver.session();

    logger.debug("obtained connection with neo4j");

    let query = 'MATCH (d:Domain{name:{domainName}}) match(i:Intent) match(d)<-[r:IntentOf]-(i) RETURN i';
    let params = {
      domainName: domain.Domain
    };
    let intents=[];
    session.run(query, params)
    .then(function(result) {
      result.records.forEach(function(record) {
        record._fields.forEach(function(fields){
          intents.push(fields.properties.name);
        });

      });
      session.close();
      domain["Intents"]=intents;
      resolve(domain);
    })
    .catch(function(err) {
      logger.error("Error in neo4j query: ", err, ' query is: ',
        query);
      reject(err);
    });
  });

  return promise;
}

let getDomainCardDetails = function(domainObj) {
  let promise = new Promise(function(resolve, reject) {
    logger.debug(" in domain card going for getting concepts for : ", domainObj);
    let driver = neo4jDriver.driver(config.NEO4J_BOLT_URL,
      neo4jDriver.auth.basic(config.NEO4J_USR, config.NEO4J_PWD),{encrypted:false}
      );

    let session = driver.session();

    logger.debug("obtained connection with neo4j");

    let query = 'MATCH (d:Domain{name:{domainName}}) match(c:Concept) match(d)<-[r:ConceptOf]-(c) RETURN c';
    let params = {
      domainName: domainObj
    };
    let concepts=[];
    session.run(query, params)
    .then(function(result) {
      result.records.forEach(function(record) {
        //logger.debug("Result from neo4j: ", record);
        record._fields.forEach(function(fields){
          logger.debug("********************************888888888888concept ", fields.properties.name);
          concepts.push(fields.properties.name);
        });

      });
    //  domainObj['concepts']=concepts;
   //number of concepts calculated
   let query1 = 'MATCH (d:Domain{name:{domainName}}) MATCH (i:Intent) MATCH (d)<-[r:IntentOf]-(i) RETURN i';
   let params1 = {
    domainName: domainObj
  };
  let intents=[];
  let intent='';
  let documents=0;
  let session1 = driver.session();
  session1.run(query1, params1)
  .then(function(result) {
    result.records.forEach(function(record) {
          //logger.debug("Result from neo4j: ", record);
          record._fields.forEach(function(fields){
            intent=fields.properties.name;
            logger.debug(" ********************************888888888888intent ", fields.properties.name);
            logger.debug("proceeding to fetch no of documents for each intent");
            let query2 = 'MATCH (d:Domain{name:{domainName}}) MATCH (c:Concept) MATCH (w:WebDocument) match(d)<-[r:ConceptOf]-(c) match(c)<-[r:HasExplanationOf]-(w) RETURN w';
            let params2 = {
              domainName: domainObj
            };
            let session2 = driver.session();
            session2.run(query2, params2)
            .then(function(result) {
              result.records.forEach(function(record) {
            //  logger.debug("Result from neo4j: ", record);
            documents=0;
            record._fields.forEach(function(fields){
              logger.debug("document for "+intent+' is '+ fields.properties.name);
              documents++;
            });

          });

              session2.close();

            })
            .catch(function(err) {
              logger.error("Error in neo4j query: ", err, ' query is: ',
                query2);

            //  reject(err);
          });
            intents.push(intent);

          });
          resolve({concepts:concepts,intents:intents,docs:documents});
        });

          // fetching intents Completed!
          session1.close();

        })
  .catch(function(err) {
    logger.error("Error in neo4j query: ", err, ' query is: ',
      query1);
    reject(err);
  });

        // Completed!
        session.close();
        //resolve({Domain:domainName,Concepts:concepts});
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
let getDomainIntentCallback = function(domainName, callback) {
  getDomainIntent(domainName).then(function(retrievedDomainConceptsAndIntents) {
    callback(null, retrievedDomainConceptsAndIntents);
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

let getDomainCardDetailsCallback = function(domainName, callback) {
  logger.debug("from the callback : "+domainName)
  getDomainCardDetails(domainName).then(function(retrievedDomainConcept) {
    callback(null, retrievedDomainConcept);
  }, function(err) {
    callback(err, null);
  });
}

module.exports = {
  indexNewDomain: indexNewDomain,
  getDomainConcept:getDomainConcept,
  getDomainIntent:getDomainIntent,
  getAllDomainConcept:getAllDomainConcept,
  indexNewDomainCallBack: indexNewDomainCallBack,
  getDomainConceptCallback: getDomainConceptCallback,
  getDomainIntentCallback: getDomainIntentCallback,
  getAllDomainConceptCallback: getAllDomainConceptCallback,
  getDomainCardDetailsCallback: getDomainCardDetailsCallback,
  getDomainCardDetails:getDomainCardDetails
}
