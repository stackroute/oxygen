const neo4jDriver = require('neo4j-driver').v1;

const logger = require('./../../applogger');

const config = require('./../../config');
const graphConsts = require('./../common/graphConstants');

let driver = neo4jDriver.driver(config.NEO4J.neo4jURL,
  neo4jDriver.auth.basic(config.NEO4J.usr, config.NEO4J.pwd), { encrypted: false }
);

let fetchIndicatorTerms = function(data) {
  let promise = new Promise(function(resolve, reject) {

    logger.debug("Now proceeding to fetchIndicatorTerms: ", data);

    let indicatorTerm = [];

    let session = driver.session();

    logger.debug("obtained connection with neo4j");

    let query = 'MATCH (i:' + graphConsts.NODE_INTENT + '{name:{intentName}}) ';
    query += 'MATCH (t:' + graphConsts.NODE_TERM + ') ';
    query += 'MATCH (d:' + graphConsts.NODE_DOMAIN + '{name:{domainName}})';
    query += 'MATCH (d)<-[r1:' + graphConsts.REL_INTENT_OF + ']-(i)';
    query += 'MATCH (i)<-[r:' + graphConsts.REL_INDICATOR_OF + ']-(t) return t.name,r.weight';

    let params = {
      domainName: data.domain,
      intentName: data.intent
    };

    session.run(query, params)
      .then(function(result) {
        result.records.forEach(function(record) {
          logger.debug("Result from neo4j: ", record);
          let i = 0;
          let obj = {};
          record._fields.forEach(function(fields) {
            i += 1;
            if (i === 1) {
              obj.term = fields;
            } else {
              obj.weight = fields;
              indicatorTerm.push(obj);
            }
          });

        });

        // Completed!
        session.close();
        data.indicatorTerms = indicatorTerm;
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

let fetchCounterIndicatorTerms = function(data) {
  let promise = new Promise(function(resolve, reject) {

    logger.debug("Now proceeding to fetch Counter Indicator Terms: ", data.intent);

    let session = driver.session();

    let counterIndicatorTerm = [];

    logger.debug("obtained connection with neo4j");

    let query = 'MATCH (i:' + graphConsts.NODE_INTENT + '{name:{intentName}}) ';
    query += 'MATCH (t:' + graphConsts.NODE_TERM + ') ';
    query += 'MATCH (d:' + graphConsts.NODE_DOMAIN + '{name:{domainName}})';
    query += 'MATCH (d)<-[r1:' + graphConsts.REL_INTENT_OF + ']-(i)';
    query += 'MATCH (i)<-[r:' + graphConsts.REL_COUNTER_INDICATOR_OF +
      ']-(t) return t.name,r.weight';

    let params = {
      domainName: data.domain,
      intentName: data.intent
    };

    session.run(query, params)
      .then(function(result) {
        result.records.forEach(function(record) {
          logger.debug("Result from neo4j: ", record);
          let i = 0;
          let obj = {};
          record._fields.forEach(function(fields) {
            i += 1;
            if (i === 1) {
              obj.term = fields;
            } else {
              obj.weight = Number(fields);
              counterIndicatorTerm.push(obj);
            }
          });

        });

        // Completed!
        session.close();
        data.counterIndicatorTerms = counterIndicatorTerm;
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

let addIntentRelationship = function(data) {
  let promise = new Promise(function(resolve, reject) {


    if (data.intensity <= 0) {
      resolve(data);
    } else {


      logger.debug("Now proceeding to add intent as relationship" +
        " b/w concept and doc ", data.intensity);

      let session = driver.session();

      logger.debug("domain " + data.domain);
      logger.debug("intent " + data.intent);
      logger.debug("concept" + data.concept);
      logger.debug("url" + data.url);

      let query = 'MATCH (w:' + graphConsts.NODE_WEBDOCUMENT + '{name:{documentUrl}}) ';
      query += 'MATCH (c:' + graphConsts.NODE_CONCEPT + '{name:{conceptName}}) ';
      query += 'MATCH (d:' + graphConsts.NODE_DOMAIN + '{name:{domainName}})';
      query += 'MERGE (c)<-[r:' + data.intent + ']-(w) SET r.intensity={intensity}';

      let params = {
        domainName: data.domain,
        intentName: data.intent,
        conceptName: data.concept,
        documentUrl: data.url,
        intensity: data.intensity
      };

      session.run(query, params)
        .then(function(result) {
          logger.debug(result);
          // Completed!
          session.close();
          resolve(data);
        })
        .catch(function(err) {
          logger.error("Error in neo4j query: ", err, ' query is: ',
            query);
          reject(err);
        });

    }
  });

  return promise;
}



module.exports = {
  fetchIndicatorTerms: fetchIndicatorTerms,
  fetchCounterIndicatorTerms: fetchCounterIndicatorTerms,
  addIntentRelationship: addIntentRelationship
}
