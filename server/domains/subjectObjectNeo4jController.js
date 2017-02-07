const neo4jDriver = require('neo4j-driver').v1;

const logger = require('./../../applogger');

const config = require('./../../config');
const graphConsts = require('./../common/graphConstants');

//@todo change the neo4j connectiont config
// let cypher = require('cypher-stream')('bolt://localhost', 'neo4j', 'password');
let cypher = require('cypher-stream')(config.NEO4J.neo4jURL, config.NEO4J.usr,
    config.NEO4J.pwd);
let fs = require('fs');

let getObjects = function(nodeObj) {
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
        if (nodeObj.nodeType == 'domain') {
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
                    result.records.forEach(function(record) {
                        if (objects.hasOwnProperty('I:' + record._fields[0])) {
                            objects['I:' + record._fields[0]].push(record._fields[1]);
                        } else {
                            objects['I:' + record._fields[0]] = [record._fields[1]];
                        }
                        if (objects.hasOwnProperty('C:' + record._fields[2])) {
                            objects['C:' + record._fields[2]].push(record._fields[3]);
                        } else {
                            objects['C:' + record._fields[2]] = [record._fields[3]];
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

        if (nodeObj.nodeType == 'concept') {
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
                    result.records.forEach(function(record) {
                        if (objects.hasOwnProperty('C:' + record._fields[0])) {
                            objects['C:' + record._fields[0]].push(record._fields[1]);
                        } else {
                            objects['C:' + record._fields[0]] = [record._fields[1]];
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
        if (nodeObj.nodeType == 'intent') {
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
                    result.records.forEach(function(record) {
                        if (objects.hasOwnProperty('T:' + record._fields[0])) {
                            objects['T:' + record._fields[0]].push(record._fields[1]);
                        } else {
                            objects['T:' + record._fields[0]] = [record._fields[1]];
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
            objectName = '',
            weight = '';

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
            weight = '{weight:5}';
        } else if (addItem.relationName == 'CounterIndicatorOf') {
            subjectName = graphConsts.NODE_INTENT;
            objectName = graphConsts.NODE_TERM;
            relation = graphConsts.REL_COUNTER_INDICATOR_OF;
            weight = '{weight:-5}';
        }

        logger.debug(weight);

        let query = 'merge (s:' + subjectName + '{name:{subjectNode}})'
        query += 'merge(o:' + objectName + '{name:{objectNode}})'
        query += 'merge(o)-[r:' + relation +weight+ ']->(s)'
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

//Create new sub concept

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

let getPublishEditedIntentTermRelation = function(editTermRelation) {
    let subjectName = editTermRelation.subjectName;
    let objectName = editTermRelation.objectName;
    let relationName = editTermRelation.relationName;
    let nodetype1=editTermRelation.subjectType;
    let nodetype2=editTermRelation.objectType;


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

        // if(editTermRelation.relationName == graphConsts.REL_INDICATOR_OF){
        //   //logger.debug("1");
        //   relationName = graphConsts.REL_COUNTER_INDICATOR_OF;
        //   weight = '{weight:-5}';
        //
        // }else { //if (editTermRelation.relationName == graphConsts.REL_COUNTER_INDICATOR_OF)
        //   //logger.debug("2");
        //   relationName = graphConsts.REL_INDICATOR_OF;
        //   weight = '{weight:5}';
        // }

        logger.debug(relationName);

        let query = 'match(s:' + nodetype2 + '{name:{objectName}})-[r:' + relationName + ']->(o:' + nodetype1 + '{name:{subjectName}})'
        query += 'Create(s)-[r1:' + relationName + ']->(o)'
        query += 'set r1 +={props}'
        query += 'delete r '
        query += 'return r1'

        let params = {
            subjectName: subjectName,
            objectName: objectName,
            relationName: relationName,
            props :editTermRelation.attributes
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

let getDeleteRelation = function(deleteObj) {
    let subject = deleteObj.subject,
        object = deleteObj.object,
        subjectType = deleteObj.subject_type,
        objectType = deleteObj.object_type,
        relation = deleteObj.relation;

    let promise = new Promise(function(resolve, reject) {
        logger.info("Now proceeding to delete the relationship for the subject :",
            deleteObj.subject
        );
        let driver = neo4jDriver.driver(config.NEO4J.neo4jURL,
            neo4jDriver.auth.basic(config.NEO4J.usr, config.NEO4J.pwd), {
                encrypted: false
            }
        );
        let session = driver.session();
        logger.debug("obtained connection with neo4j");

        let query = '';
        let params = {};
        if (subjectType === graphConsts.NODE_CONCEPT && objectType === graphConsts.NODE_DOMAIN) {
            query += 'match(c:' + graphConsts.NODE_CONCEPT + '{name:{subject}})-[r:' + relation + ']->(d:' + graphConsts.NODE_DOMAIN + '{name:{object}})'
            query += 'detach delete(r)' ;

            params = {
                subject: subject,
                object: object,
                relation: relation
            };

        }

        session.run(query, params).then(function(result) {
                session.close();
                resolve(true);
            })
            .catch(function(error) {
                logger.error("Error in NODE_CONCEPT query: ", error, ' query is: ', query);
                reject(error);
            });
    });
    return promise;
}


let getPublishAddItemCallback = function(addItem, callback) {
    logger.debug("from the callback : " + addItem.subjectNode);
    getPublishAddItem(addItem).then(function(addItemDetails) {
        callback(null, addItemDetails);
    }, function(err) {
        callback(err, null);
    });
};

let getObjectsCallback = function(nodeObj, callback) {
    logger.debug("from the callback : " + nodeObj)
    getObjects(nodeObj).then(function(retrievedObjects) {
        callback(null, retrievedObjects);
    }, function(err) {
        callback(err, null);
    });
};

let getPublishSubConceptCallback = function(conceptObj, callback) {
    logger.debug("from the callback : " + conceptObj.subject);
    getPublishSubConcept(conceptObj).then(function(subConceptDetails) {
        callback(null, subConceptDetails);
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

let getDeleteRelationCallback = function(deleteObj, callback) {
    logger.debug("from the callback : " + deleteObj);
    getDeleteRelation(deleteObj).then(function(result) {
        callback(null, result);
    }, function(err) {
        callback(err, null);
    });
}

module.exports = {
    getPublishAddItemCallback: getPublishAddItemCallback,
    getObjectsCallback: getObjectsCallback,
    getPublishSubConceptCallback: getPublishSubConceptCallback,
    getPublishEditedIntentTermRelationCallback: getPublishEditedIntentTermRelationCallback,
    getDeleteRelationCallback: getDeleteRelationCallback
};
