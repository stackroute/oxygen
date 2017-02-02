const neo4jDriver = require('neo4j-driver').v1;

const logger = require('./../../applogger');

const config = require('./../../config');
const graphConsts = require('./../common/graphConstants');

let getPublishSubConcept = function(addSubconcept) {
    let subjectName = addSubconcept.subjectNode;
    let objectName = addSubconcept.objectNode;
    logger.debug(objectName);

    let promise = new Promise(function(resolve, reject) {
        logger.debug(
            "Now proceeding to publish the concepts for domain name: ",
            subjectName);
        let driver = neo4jDriver.driver(config.NEO4J.neo4jURL,
            neo4jDriver.auth.basic(config.NEO4J.usr, config.NEO4J.pwd), {
                encrypted: false
            }
        );

        let session = driver.session();

        logger.debug("obtained connection with neo4j");

        let query = 'match (s: ' + graphConsts.NODE_CONCEPT +
          '{name: {subjectName}} )'
       query += 'match(o: ' + graphConsts.NODE_CONCEPT +
         '{name: {objectName}} )'
       query += 'merge(o)-[r: ' + graphConsts.REL_SUB_CONCEPT_OF + ']->(s)'
       query += 'return r';

        let params = {
            subjectName: subjectName,
            objectName: objectName,
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

let getPublishEditedSubConcept = function(conceptObj) {
    let subjectName = conceptObj.subject;
    let objectName = conceptObj.object;
    let relationName = conceptObj.relation;
    let previousName = conceptObj.previous;
    logger.debug(subjectName);
    let promise = new Promise(function(resolve, reject) {
        logger.debug(
            "Now proceeding to publish the edited concepts for domain name: ",
            subjectName);
        let driver = neo4jDriver.driver(config.NEO4J.neo4jURL,
            neo4jDriver.auth.basic(config.NEO4J.usr, config.NEO4J.pwd), {
                encrypted: false
            }
        );

        let session = driver.session();

        logger.debug("obtained connection with neo4j");

        let query = 'match(s:' + graphConsts.NODE_CONCEPT + '{name:{subjectName}})-[r:' + previousName + ']->(o:' + graphConsts.NODE_CONCEPT + '{name:{objectName}})'
        query += 'merge(s)-[r1:' + relationName + ']->(o)'
        query += 'delete r '
        query += 'return r1'

        let params = {
            subjectName: subjectName,
            objectName: objectName,
            relationName: relationName
        };

        logger.debug(query);

        session.run(query, params).then(function(result) {
                if (result) {
                    logger.debug(result);
                }
                session.close();
                resolve(objectName);
            })
            .catch(function(error) {
                logger.error("Error in NODE_CONCEPT query: ", error, ' query is: ', query);
                reject(error);
            });
    });
    return promise;
};


let getPublishSubConceptCallback = function(conceptObj, callback) {
    logger.debug("from the callback : " + conceptObj.subject);
    getPublishSubConcept(conceptObj).then(function(subConceptDetails) {
        callback(null, subConceptDetails);
    }, function(err) {
        callback(err, null);
    });
};

let getPublishEditedSubConceptCallback = function(conceptObj, callback) {
    logger.debug("from the callback : " + conceptObj.subject);
    getPublishEditedSubConcept(conceptObj).then(function(subConceptDetails) {
        callback(null, subConceptDetails);
    }, function(err) {
        callback(err, null);
    });
};


module.exports = {
    getPublishSubConceptCallback: getPublishSubConceptCallback,
    getPublishEditedSubConceptCallback: getPublishEditedSubConceptCallback
};
