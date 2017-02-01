const neo4jDriver = require('neo4j-driver').v1;

const logger = require('./../../applogger');

const config = require('./../../config');
const graphConsts = require('./../common/graphConstants');

//@todo change the neo4j connectiont config
// let cypher = require('cypher-stream')('bolt://localhost', 'neo4j', 'password');
let cypher = require('cypher-stream')(config.NEO4J.neo4jURL, config.NEO4J.usr,
  config.NEO4J.pwd);
let fs = require('fs');

let getObjects = function(nodeObj){
  let promise = new Promise(function(resolve, reject) {

    logger.debug("Now proceeding to retrive objects for node name: ",
      nodeObj.nodeName);
    let driver = neo4jDriver.driver(config.NEO4J.neo4jURL,
      neo4jDriver.auth.basic(config.NEO4J.usr, config.NEO4J.pwd), {
        encrypted: false
      }
    );

    let session = driver.session();

    logger.debug("obtained connection with neo4j");
    if(nodeObj.nodeType == 'domain'){
      let query = 'MATCH (d:' + graphConsts.NODE_DOMAIN +
       '{name:{nodeName}})'
      query += 'match (i:' + graphConsts.NODE_INTENT + ')'
      query += 'match (c:' + graphConsts.NODE_CONCEPT + ')'
      query += 'match (d)<-[r]-(i)'
      query += 'match (d)<-[r1]-(c) RETURN i.name as Intent,type(r) as relationIntent, c.name as Concept, type(r1) as relationConcept';

      let params = {
        nodeName: nodeObj.nodeName
      };
      let objects = {};

      session.run(query, params)
        .then(function(result) {
          result.records.forEach(function(record){
            if(objects.hasOwnProperty('I:'+ record._fields[0])){
              objects['I:'+ record._fields[0]].push(record._fields[1]);
            }else{
              objects['I:'+ record._fields[0]] = [record._fields[1]];
            }
            if(objects.hasOwnProperty('C:'+ record._fields[2])){
              objects['C:'+ record._fields[2]].push(record._fields[3]);
            }else{
              objects['C:'+ record._fields[2]] = [record._fields[3]];
            }
          });
          session.close();
          logger.debug(objects);
          resolve(objects);
        })
        .catch(function(err) {
          logger.error("Error in neo4j query: ", err, ' query is: ',
            query);
          reject(err);
        });
    }

    if(nodeObj.nodeType == 'concept'){
      let query = 'MATCH (g:' + graphConsts.NODE_CONCEPT + ')'
      query += 'match (c:' + graphConsts.NODE_CONCEPT +
        '{name:{nodeName}})'
      query += 'match (g)<-[r]-(c) RETURN c.name as conceptName,type(r) as relationConcept';

      let params = {
        nodeName: nodeObj.nodeName,
      };
      let objects = {};

      session.run(query, params)
        .then(function(result) {
          result.records.forEach(function(record){
            if(objects.hasOwnProperty('C:'+ record._fields[0])){
              objects['C:'+ record._fields[0]].push(record._fields[1]);
            }else{
              objects['C:'+ record._fields[0]] = [record._fields[1]];
            }
          });
          session.close();
          logger.debug(objects);
          resolve(objects);
        })
        .catch(function(err) {
          logger.error("Error in neo4j query: ", err, ' query is: ',
            query);
          reject(err);
        });
    }
    if(nodeObj.nodeType == 'intent'){
      let query = 'MATCH (t:' + graphConsts.NODE_TERM + ')'
      query += 'match (i:' + graphConsts.NODE_INTENT +
        '{name:{nodeName}})'
      query += 'match (i)<-[r]-(t) RETURN t.name as termName,type(r) as relationIntent';

      let params = {
        nodeName: nodeObj.nodeName,
      };
      let objects = {};

      session.run(query, params)
        .then(function(result) {
          result.records.forEach(function(record){
            if(objects.hasOwnProperty('T:'+record._fields[0])){
              objects['T:'+record._fields[0]].push(record._fields[1]);
            }else{
              objects['T:'+ record._fields[0]] = [record._fields[1]];
            }
          });
          session.close();
          logger.debug(objects);
          resolve(objects);
        })
        .catch(function(err) {
          logger.error("Error in neo4j query: ", err, ' query is: ',
            query);
          reject(err);
        });
    }
  });
  return promise;
};

let getObjectsCallback = function(nodeObj, callback){
  logger.debug("from the callback : " + nodeObj)
  getObjects(nodeObj).then(function(retrievedObjects) {
    callback(null, retrievedObjects);
  }, function(err) {
    callback(err, null);
  });
}

let getPublishAddItem = function(addItem) {

    logger.debug(addItem.subjectNode);
    let promise = new Promise(function(resolve, reject) {
        logger.debug(
            "Now proceeding to publish subjectNode name: ",
            addItem.subjectNode);
        // logger.debug("Type of object",typeof objectNode);
        // logger.debug("Type of relation",typeof relationName);

        let driver = neo4jDriver.driver(config.NEO4J.neo4jURL,
            neo4jDriver.auth.basic(config.NEO4J.usr, config.NEO4J.pwd), {
                encrypted: false
            }
        );

        let session = driver.session();

        logger.debug("obtained connection with neo4j");

        var subjectName = '',
            relation = '',
            objectName = '';

        if (addItem.relationName == 'ConceptOf') {
            logger.debug("Concept");
            subjectName = graphConsts.NODE_DOMAIN;
            objectName = graphConsts.NODE_CONCEPT;
            relation = graphConsts.REL_CONCEPT_OF;
        } else if (addItem.relationName == 'IntentOf') {
            subjectName = graphConsts.NODE_DOMAIN;
            objectName = graphConsts.NODE_INTENT;
            relation = graphConsts.REL_INTENT_OF;
        } else if (addItem.relationName == 'IndicatorOf') {
            subjectName = graphConsts.NODE_INTENT;
            objectName = graphConsts.NODE_TERM;
            relation = graphConsts.REL_INDICATOR_OF;
        } else if (addItem.relationName == 'CounterIndicatorOf') {
            subjectName = graphConsts.NODE_INTENT;
            objectName = graphConsts.NODE_TERM;
            relation = graphConsts.REL_COUNTER_INDICATOR_OF;
        }

        logger.debug(subjectName);

        let query = 'merge (s:' + subjectName + '{name:{subjectNode}})'
        query += 'merge(o:' + objectName + '{name:{objectNode}})'
        query += 'merge(o)-[r:' + relation + ']->(s)'
            //query += 'return r'

        let params = {
            subjectNode: addItem.subjectNode,
            objectNode: addItem.objectNode,
            //relationName: addItem.relationName
        };

        session.run(query, params).then(function(result) {
                if (result) {
                    logger.debug(result);
                }
                session.close();
                resolve(result);
            })
            .catch(function(error) {
                logger.error("Error in NODE_CONCEPT query: ", error, ' query is: ', query);
                reject(error);
            });
    });
    return promise;
};

let getPublishEditRelationItem = function(editRelationItem) {

    logger.debug(editRelationItem.subjectNode);
    let promise = new Promise(function(resolve, reject) {
        logger.debug(
            "Now proceeding to publish subjectNode name: ",
            editRelationItem.subjectNode);
        // logger.debug("Type of object",typeof objectNode);
        // logger.debug("Type of relation",typeof relationName);

        let driver = neo4jDriver.driver(config.NEO4J.neo4jURL,
            neo4jDriver.auth.basic(config.NEO4J.usr, config.NEO4J.pwd), {
                encrypted: false
            }
        );

        let session = driver.session();

        logger.debug("obtained connection with neo4j");

        var subjectName = '',
            relation = '',
            objectName = '';

        if (addItem.relationName == 'ConceptOf') {
            logger.debug("Concept");
            subjectName = graphConsts.NODE_DOMAIN;
            objectName = graphConsts.NODE_CONCEPT;
            relation = graphConsts.REL_CONCEPT_OF;
        } else if (addItem.relationName == 'IntentOf') {
            subjectName = graphConsts.NODE_DOMAIN;
            objectName = graphConsts.NODE_INTENT;
            relation = graphConsts.REL_INTENT_OF;
        } else if (addItem.relationName == 'IndicatorOf') {
            subjectName = graphConsts.NODE_INTENT;
            objectName = graphConsts.NODE_TERM;
            relation = graphConsts.REL_INDICATOR_OF;
        } else if (addItem.relationName == 'CounterIndicatorOf') {
            subjectName = graphConsts.NODE_INTENT;
            objectName = graphConsts.NODE_TERM;
            relation = graphConsts.REL_COUNTER_INDICATOR_OF;
        }

        logger.debug(subjectName);

        let query = 'merge (s:' + subjectName + '{name:{subjectNode}})'
        query += 'merge(o:' + objectName + '{name:{objectNode}})'
        query += 'merge(o)-[r:' + relation + ']->(s)'
            //query += 'return r'

        let params = {
            subjectNode: addItem.subjectNode,
            objectNode: addItem.objectNode,
            //relationName: addItem.relationName
        };

        session.run(query, params).then(function(result) {
                if (result) {
                    logger.debug(result);
                }
                session.close();
                resolve(result);
            })
            .catch(function(error) {
                logger.error("Error in NODE_CONCEPT query: ", error, ' query is: ', query);
                reject(error);
            });
    });
    return promise;
};


let getPublishAddItemCallback = function(addItem, callback) {
    logger.debug("from the callback : " + addItem.subjectNode);
    getPublishAddItem(addItem).then(function(addItemDetails) {
        callback(null, addItemDetails);
    }, function(err) {
        callback(err, null);
    });
};

let getPublishEditRelationItemCallback = function(editRelationItem, callback) {
    logger.debug("from the callback : " + editRelationItem.subjectNode);
    getPublishEditRelationItem(editRelationItem).then(function(editRelationItemDetails) {
        callback(null, editRelationItemDetails);
    }, function(err) {
        callback(err, null);
    });
};

module.exports = {
    getPublishAddItemCallback: getPublishAddItemCallback,
    getPublishEditRelationItemCallback: getPublishEditRelationItemCallback,
    getObjectsCallback: getObjectsCallback
};
