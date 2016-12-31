const neo4jDriver = require('neo4j-driver').v1;
const logger = require('./../../applogger');
const config = require('./../../config');
const graphConsts = require('./../common/graphConstants');

let driver = neo4jDriver.driver(config.NEO4J.neo4jURL,
  neo4jDriver.auth.basic(config.NEO4J.usr, config.NEO4J.pwd),{encrypted:false});

let getTerms = function(data) {
  let promise = new Promise(function(resolve, reject) {
    logger.debug("Now proceeding to get all terms of domain: ", data.domain);

    let query = 'MATCH(d:'+graphConsts.NODE_DOMAIN+')<-[]-(i:'+graphConsts.NODE_INTENT+')<-[]-(t:'
    +graphConsts.NODE_TERM+') where d.name={name} return t';

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

    //let rel=[];

    logger.debug("obtained connection with neo4j");

    let query = 'Match (d:'+graphConsts.NODE_DOMAIN+'{name:{domainName}})  Match (c:'
    +graphConsts.NODE_CONCEPT+'{name:{conceptName}}) Match(d)<-[r1:'+
    graphConsts.REL_CONCEPT_OF+']-(c) MERGE(c)<-[r:'+graphConsts.REL_HAS_EXPLANATION_OF
    +']-(u:'+graphConsts.NODE_WEBDOCUMENT+'{name:{urlName}}) return r';
    let params = {
      domainName: data.domain,
      conceptName: data.concept,
      urlName: data.url
    };
    session.run(query , params)
    .then(function(result) {
      logger.debug("Result for terms from neo4j: ", result);
        //rel.push(record._fields[0].properties.name);

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

let fetchIntents = function(data) {
  let promise = new Promise(function(resolve, reject) {

    logger.debug("Now proceeding to get intents to domain: ", data.concept);

    let session = driver.session();

    let intents=[];

    logger.debug("obtained connection with neo4j");

    let query = 'Match (d:'+graphConsts.NODE_DOMAIN+'{name:{domainName}}) Match (i:'+
    graphConsts.NODE_INTENT+') Match(d)<-[r:'+graphConsts.REL_INTENT_OF+']-(i) return i';
    let params = {
      domainName: data.domain
    };
    session.run(query , params)
    .then(function(result) {     
      result.records.forEach(function(record) {

       record._fields.forEach(function(field){
        logger.debug("Result for getting intents from neo4j: ", field.properties.name);
        intents.push(field.properties.name);
      })


     });
        // Completed!
        session.close();
        logger.debug('inside neo4J intent fetching ',intents)
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
  getUrlIndexed:getUrlIndexed,
  fetchIntents:fetchIntents
}
