const neo4jDriver = require('neo4j-driver').v1;

const logger = require('./../../applogger');

const config = require('./../../config');
const graphConsts = require('./../common/graphConstants');

let getPublishTerm = function(intentObj) {
    let intentName = intentObj.intent;
    let termName = intentObj.term;
    let relation = intentObj.relation;
    let query = '';
    logger.debug(intentName);
    let promise = new Promise(function(resolve, reject) {
        logger.debug(
            "Now proceeding to publish the terms for intent name: ",
            intentName);
        let driver = neo4jDriver.driver(config.NEO4J.neo4jURL,
            neo4jDriver.auth.basic(config.NEO4J.usr, config.NEO4J.pwd), {
                encrypted: false
            }
        );

        let session = driver.session();

        logger.debug("obtained connection with neo4j");

        if (relation === "indicator") {
            query += 'merge (c:' + graphConsts.NODE_TERM + '{name:{termName}})'
            query += 'merge(d:' + graphConsts.NODE_INTENT + '{name:{intentName}})'
            query += 'merge(c)-[r:' + graphConsts.REL_INDICATOR_OF + '{weight:5}]->(d)'
        } else {
            query += 'merge (c:' + graphConsts.NODE_TERM + '{name:{termName}})'
            query += 'merge(d:' + graphConsts.NODE_INTENT + '{name:{intentName}})'
            query += 'merge(c)-[r:' + graphConsts.REL_COUNTER_INDICATOR_OF + '{weight:-5}]->(d)'
        }


        let params = {
            termName: termName,
            intentName: intentName
        };

        session.run(query, params).then(function(result) {
                if (result) {
                    logger.debug(result);
                }
                session.close();
                resolve(intentObj);
            })
            .catch(function(error) {
                logger.error("Error in NODE_TERM query: ", error, ' query is: ', query);
                reject(error);
            });
    });
    return promise;
};

let getPublishEditedIntentTermRelation = function(editTermRelation) {
    let intentName = editTermRelation.intentName;
    let termName = editTermRelation.termName;
    let relationName = '';

    logger.debug(relationName);
    let promise = new Promise(function(resolve, reject) {
        logger.debug(
            "Now proceeding to publish the edited intent term relation: ",
            editTermRelation.relationName);
        let driver = neo4jDriver.driver(config.NEO4J.neo4jURL,
            neo4jDriver.auth.basic(config.NEO4J.usr, config.NEO4J.pwd), {
                encrypted: false
            }
        );

        let session = driver.session();

        logger.debug("obtained connection with neo4j");

        if(editTermRelation.relationName == graphConsts.REL_INDICATOR_OF){
          //logger.debug("1");
          relationName = graphConsts.REL_COUNTER_INDICATOR_OF;

        }else { //if (editTermRelation.relationName == graphConsts.REL_COUNTER_INDICATOR_OF)
          //logger.debug("2");
          relationName = graphConsts.REL_INDICATOR_OF;
        }

        logger.debug(relationName);

        let query = 'match(s:' + graphConsts.NODE_TERM + '{name:{termName}})-[r:' + editTermRelation.relationName + ']->(o:' + graphConsts.NODE_INTENT + '{name:{intentName}})'
        query += 'merge(s)-[r1:' + relationName + ']->(o)'
        query += 'delete r '
        query += 'return r1'

        let params = {
            intentName: intentName,
            termName: termName,
            relationName: relationName
        };

        logger.debug(query);

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


let getPublishTermCallback = function(intentObj, callback) {
    logger.debug("from the callback : " + intentObj.intent);
    getPublishTerm(intentObj).then(function(termDetails) {
        callback(null, termDetails);
    }, function(err) {
        callback(err, null);
    });
};

let getPublishEditedIntentTermRelationCallback = function(editTermRelation, callback) {
    logger.debug("from the callback : " + editTermRelation.intentName);
    getPublishEditedIntentTermRelation(editTermRelation).then(function(termRelationDetails) {
        callback(null, termRelationDetails);
    }, function(err) {
        callback(err, null);
    });
};

module.exports = {
    getPublishTermCallback: getPublishTermCallback,
    getPublishEditedIntentTermRelationCallback: getPublishEditedIntentTermRelationCallback
};
