const neo4jDriver = require('neo4j-driver').v1;

const logger = require('./../../applogger');

const config = require('./../../config');
const graphConsts = require('./../common/graphConstants');

let indexNewDomain = function(newDomainObj) {
  let promise = new Promise(function(resolve, reject) {

    logger.debug("Now proceeding to index new domain: ", newDomainObj);
    let driver = neo4jDriver.driver(config.NEO4J.neo4jURL,
      neo4jDriver.auth.basic(config.NEO4J.usr, config.NEO4J.pwd),{encrypted:false}
      );

    let session = driver.session();

    logger.debug("obtained connection with neo4j");

    let query = 'MERGE (d:'+graphConsts.NODE_DOMAIN+' {name:{domainName}}) return d';
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
    let driver = neo4jDriver.driver(config.NEO4J.neo4jURL,
      neo4jDriver.auth.basic(config.NEO4J.usr, config.NEO4J.pwd),{encrypted:false}
      );

    let session = driver.session();

    logger.debug("obtained connection with neo4j");
    let data=[];

    domainNameColln.forEach(function(domainName){

      let query = 'MATCH (d:'+graphConsts.NODE_DOMAIN+'{name:{domainName}})'
      query+= 'match(c:'+graphConsts.NODE_CONCEPT+')'
      query+= 'match(d)<-[r:'+graphConsts.REL_CONCEPT_OF+']-(c)  RETURN d,count(c)';

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
            if(typeof field.low==='undefined')
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
        if(data.length===domainNameColln.length){
          resolve(data);
        }
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
    let driver = neo4jDriver.driver(config.NEO4J.neo4jURL,
      neo4jDriver.auth.basic(config.NEO4J.usr, config.NEO4J.pwd),{encrypted:false}
      );

    let session = driver.session();

    logger.debug("obtained connection with neo4j");

    let query = 'MATCH (d:'+graphConsts.NODE_DOMAIN+'{name:{domainName}})'
    query+= 'match(c:'+graphConsts.NODE_CONCEPT+')'
    query+= 'match(d)<-[r:'+graphConsts.REL_CONCEPT_OF+']-(c) RETURN c';
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
      logger.error("Error in NODE_INTENT query: ", err, ' query is: ',
        query);
      reject(err);
    });
  });

  return promise;
}

let getDomainIntent = function(domain) {
  let promise = new Promise(function(resolve, reject) {

    logger.debug("Now proceeding to retrive the intent for domain name: ", domain.Domain);
    let driver = neo4jDriver.driver(config.NEO4J.neo4jURL,
      neo4jDriver.auth.basic(config.NEO4J.usr, config.NEO4J.pwd),{encrypted:false}
      );

    let session = driver.session();

    logger.debug("obtained connection with neo4j");

    let query = 'MATCH (d:'+graphConsts.NODE_DOMAIN+'{name:{domainName}})'
    query+= 'match(i:'+graphConsts.NODE_INTENT+')'
    query+= 'match(d)<-[r:'+graphConsts.REL_INTENT_OF+']-(i) RETURN i';
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
      domain.Intents=intents;
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
    let driver = neo4jDriver.driver(config.NEO4J.neo4jURL,
      neo4jDriver.auth.basic(config.NEO4J.usr, config.NEO4J.pwd),{encrypted:false}
      );

    let session = driver.session();

    logger.debug("obtained connection with neo4j");

    let query = 'MATCH (d:'+graphConsts.NODE_DOMAIN+'{name:{domainName}})'
    query+= 'match(c:'+graphConsts.NODE_CONCEPT+')'
    query+= 'match(d)<-[r:'+graphConsts.REL_CONCEPT_OF+']-(c) RETURN c';
    let params = {
      domainName: domainObj
    };
    let concepts=[];
    session.run(query, params)
    .then(function(result) {
      result.records.forEach(function(record) {
        //logger.debug("Result from neo4j: ", record);
        record._fields.forEach(function(fields){
          logger.debug("domain Concept :", fields.properties.name);
          concepts.push(fields.properties.name);
        });

      });
    //  domainObj['concepts']=concepts;
   //number of concepts calculated
   let query1 = 'MATCH (d:'+graphConsts.NODE_DOMAIN+'{name:{domainName}})'
   query1+= 'MATCH (i:'+graphConsts.NODE_INTENT+')'
   query1+= 'MATCH (d)<-[r:'+graphConsts.REL_INTENT_OF+']-(i) RETURN i';
   let params1 = {
    domainName: domainObj
  };
  let intents=[];
  let intent='';
  let documents=0;
  let session1 = driver.session();
  session1.run(query1, params1)
  .then(function(outerResults) {
    outerResults.records.forEach(function(record) {
          //logger.debug("Result from neo4j: ", record);
          record._fields.forEach(function(fields){
            intent=fields.properties.name;
            intents.push(intent);
            logger.debug(" domain intent ", fields.properties.name);

          });
        });

          // fetching intents Completed!

          logger.debug("proceeding to fetch no of documents");
          let query2 = 'MATCH (d:'+graphConsts.NODE_DOMAIN+'{name:{domainName}})'
          query2+= 'MATCH (c:'+graphConsts.NODE_CONCEPT+')'
          query2+= 'MATCH (w:'+graphConsts.NODE_WEBDOCUMENT+')'
          query2+= 'match(d)<-[r:'+graphConsts.REL_CONCEPT_OF+']-(c)'
          query2+= 'match(c)<-[r1:'+graphConsts.REL_HAS_EXPLANATION_OF+']-(w) RETURN w';
          let params2 = {
            domainName: domainObj
          };
          let session2 = driver.session();
          session2.run(query2, params2)
          .then(function(results) {
            if(results.records.length===0)
            {
              resolve({concepts:concepts,intents:intents,docs:documents});
            }
            else
            {
              results.records.forEach(function(records) {
                records._fields.forEach(function(field){
                  logger.debug('document is'+ field.properties.name);
                  documents+=1;
                  logger.debug('Number is ++++++++++++++++^^^^^##### '+documents);
                });
                logger.debug('Number is  '+documents);
              });
              resolve({concepts:concepts,intents:intents,docs:documents});
            }
            session2.close();

          })
          .catch(function(err) {
            logger.error("Error in neo4j query: ", err, ' query is: ',
              query2);

            //  reject(err);
          });

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

let getWebDocuments = function(domainObj) {
  let promise = new Promise(function(resolve, reject) {

    logger.debug("Now proceeding to retrive "+
      "the web Documents for domain name: ", domainObj.domainName);
    let driver = neo4jDriver.driver(config.NEO4J.neo4jURL,
      neo4jDriver.auth.basic(config.NEO4J.usr, config.NEO4J.pwd),{encrypted:false}
      );

    let session = driver.session();

    logger.debug("obtained connection with neo4j");
    let query='';
    let str=JSON.stringify(domainObj.reqConcepts);
    let str1=JSON.stringify(domainObj.reqIntents);
    logger.debug("***********"+str+"     "+str1);
    if(domainObj.reqIntents.length===0)
    {
      query += 'MATCH (d:'+graphConsts.NODE_DOMAIN+'{name:{domainName}})'
      query += 'match(c:'+graphConsts.NODE_CONCEPT+')'
      query += 'match(d)<-[r1:'+graphConsts.REL_CONCEPT_OF+']-(c)'
      query += 'MATCH (w:'+graphConsts.NODE_WEBDOCUMENT+')';
      query +=' match(w)-[r]-(c) where c.name in '+str;
      query +=' return w.name,sum(r.intensity) as sum order by sum desc';
    }
    else
    {
      query += 'MATCH (d:'+graphConsts.NODE_DOMAIN+'{name:{domainName}})'
      query += 'match (c:'+graphConsts.NODE_CONCEPT+')'
      query += 'match(d)<-[r1:'+graphConsts.REL_CONCEPT_OF+']-(c)'
      query += 'MATCH (w:'+graphConsts.NODE_WEBDOCUMENT+')';
      query+= 'match(w)-[r]-(c) where type(r) in '+str1+' and c.name in '+str;
      query+= 'return w.name,sum(r.intensity) as sum order by sum desc';
    }
    let params = {
      domainName: domainObj.domainName
    };
    logger.debug("@@@@@@@@@ "+query);

    let docs=[];
    session.run(query, params)
    .then(function(result) {
      result.records.forEach(function(record) {
        logger.debug("Result from neo4j: ", record);
        let i=0;
        let obj={};
        record._fields.forEach(function(fields){
          i+=1;
          if(i===1)
          {
            obj.url=fields;
          }
          else
          {
            obj.intensity=Number(fields);
            docs.push(obj);
          }
        });

      });
      session.close();
      resolve(docs);
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

let getWebDocumentsCallback = function(domainObj, callback) {
  logger.debug("from the callback : "+domainObj)
  getWebDocuments(domainObj).then(function(retrievedDocs) {
    callback(null, retrievedDocs);
  }, function(err) {
    callback(err, null);
  });
}

module.exports = {
  indexNewDomain: indexNewDomain,
  getDomainConcept: getDomainConcept,
  getDomainIntent: getDomainIntent,
  getAllDomainConcept: getAllDomainConcept,
  indexNewDomainCallBack: indexNewDomainCallBack,
  getDomainConceptCallback: getDomainConceptCallback,
  getDomainIntentCallback: getDomainIntentCallback,
  getAllDomainConceptCallback: getAllDomainConceptCallback,
  getDomainCardDetailsCallback: getDomainCardDetailsCallback,
  getDomainCardDetails: getDomainCardDetails,
  getWebDocumentsCallback: getWebDocumentsCallback,
  getWebDocuments: getWebDocuments
}
