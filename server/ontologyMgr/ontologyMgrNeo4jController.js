const neo4jDriver = require('neo4j-driver').v1;
const logger = require('./../../applogger');
const config = require('./../../config');
const graphConsts = require('./../common/graphConstants');

let getPublishAddNode = function(subject, object) {

    let promise = new Promise(function(resolve, reject) {
        logger.debug("Now proceeding to publish subject: ", subject.nodeName);
        let driver = neo4jDriver.driver(config.NEO4J.neo4jURL,
            neo4jDriver.auth.basic(config.NEO4J.usr, config.NEO4J.pwd), {
                encrypted: false
            }
        );

        let session = driver.session();

        var predicateWeight = '';
        var subjectDomainname = subject.domainName;
        var subjectNodeType = subject.nodeType;
        var subjectNodeName = subject.nodeName;
        var attributesVar = '';
        for (k in object.attributes) {
            attributesVar = attributesVar + ',' + k + ':"' + object.attributes[k] + '"';
        }

        let query = '';
        let params = {};

        for (var i = 0; i < object.objects.length; i++) {
            objectURL = object.objects[i].name;
            splitArray = objectURL.split('/');

            var objectDomainname = splitArray[2];
            var objectNodeType = splitArray[4];
            var objectNodeName = splitArray[5];

            for (j = 0; j < object.objects[i].predicates.length; j++) {
                var predicateName = object.objects[i].predicates[j].name;
                var predicateDirection = object.objects[i].predicates[j].direction;

                if (objectNodeType == graphConsts.NODE_TERM && predicateName == graphConsts.REL_INDICATOR_OF) {
                    predicateWeight = '{weight:5}';
                } else if (objectNodeType == graphConsts.NODE_TERM && predicateName == graphConsts.REL_COUNTER_INDICATOR_OF) {
                    predicateWeight = '{weight:-5}';
                }

                if (predicateDirection == 'I') {
                    query = 'merge (s:' + subjectNodeType + '{name:{subjectNodeName}' + attributesVar + '})'
                    query += ' merge(o:' + objectNodeType + '{name:{objectNodeName}})'
                    query += ' merge(o)-[r:' + predicateName + predicateWeight + ']->(s)'
                    query += ' return r'
                } else if (predicateDirection == 'O') {
                    query = 'merge (s:' + subjectNodeType + '{name:{subjectNodeName}' + attributesVar + '})'
                    query += ' merge(o:' + objectNodeType + '{name:{objectNodeName}})'
                    query += ' merge(o)<-[r:' + predicateName + predicateWeight + ']-(s)'
                    query += ' return r'
                }

                params = {
                    subjectNodeName: subjectNodeName,
                    objectNodeName: objectNodeName
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
            }
        }
    });
    return promise;
};

let deleteOrphans = function(deleteObj) {
    let nodeType = deleteObj.nodeType.toLowerCase();
    let nodeRef = nodeType.charAt(0);
    let promise = new Promise(function(resolve, reject) {
        logger.info("Now proceeding to delete the orphaned node:",
            deleteObj
        );
        logger.info("nodeRef is",
            nodeRef
        );
        let cypher = require('cypher-stream')(config.NEO4J.neo4jURL, config.NEO4J.usr,
            config.NEO4J.pwd);
        let fs = require('fs');
        let promise = new Promise(function(resolve, reject) {
            logger.debug(subject.nodename);
            let driver = neo4jDriver.driver(config.NEO4J.neo4jURL,
                neo4jDriver.auth.basic(config.NEO4J.usr, config.NEO4J.pwd), {
                    encrypted: false
                });
            let session = driver.session();
            logger.debug("obtained connection with neo4j");
            let query = '';
            let params = {};
            if (deleteObj.cascade == 1) {
                query += 'match (s:' + deleteObj.nodeType + ')<-[r]-(allRelatedNodes)'
                query += 'WHERE s.name = {nodeName}'
                query += 'AND size((allRelatedNodes)--()) = 1 '
                query += 'DETACH DELETE s, allRelatedNodes';
                params = {
                    // nodeType: nodetype,
                    nodeName: deleteObj.nodeName
                };

            } else {
                query += 'match (s:' + deleteObj.nodeType + ')<-[r]-(allRelatedNodes)'
                query += 'WHERE s.name = {nodeName}'
                query += 'detach delete s';
                params = {
                    // nodeType: nodetype,
                    nodeName: deleteObj.nodeName
                };
            }
            logger.debug("Query ", query);
            session.run(query, params).then(function(result) {
                    if (result) {
                        logger.debug(result);
                    }
                    session.close();
                    resolve(result);
                })
                .catch(function(error) {
                    logger.error("Error in query: ", error, ' query is: ', query);
                    reject(error);
                });
        });
        return promise;
    });
};

let getRelations = function(subject) {
    let promise = new Promise(function(resolve, reject) {
        logger.debug(subject.nodename);
        let driver = neo4jDriver.driver(config.NEO4J.neo4jURL,
            neo4jDriver.auth.basic(config.NEO4J.usr, config.NEO4J.pwd), {
                encrypted: false
            });
        let session = driver.session();
        logger.debug("obtained connection with neo4j");
        logger.debug("subject", subject.predicates)
        var subjectDomainname = subject.domainname;
        var subjectNodeType = subject.nodetype;
        var subjectNodeName = subject.nodename;
        var objectNodeType = subject.nodetype1;
        var objectNodeName = subject.nodename1;
        var predicateName = subject.predicates;
        // MATCH (:Person { name: 'Oliver Stone' })-->(movie)
        // RETURN movie.title
        query = 'match (s:' + subjectNodeType + '{name: {subjectNodeName}})<-[r:' + predicateName + ']-(o:' + objectNodeType + '{name:{objectNodeName}})'
        query += ' return r'
        params = {
            subjectNodeName: subjectNodeName,
            objectNodeName: objectNodeName,
            subjectNodeType: subjectNodeType,
            objectNodeType: objectNodeType,
            predicateName: predicateName
        };
        //  logger.debug("subjectNodeName", params.subjectNodeName)
        session.run(query, params).then(function(result) {
                if (result) {
                    logger.debug(result);
                }
                session.close();
                resolve(result);
            })
            .catch(function(error) {
                logger.error("Error in query: ", error, ' query is: ', query);
                reject(error);
            });
    });
    return promise;
};

let getAllRelations = function(subject) {
    let promise = new Promise(function(resolve, reject) {
        logger.debug(subject.nodename);
        let driver = neo4jDriver.driver(config.NEO4J.neo4jURL,
            neo4jDriver.auth.basic(config.NEO4J.usr, config.NEO4J.pwd), {
                encrypted: false
            });
        let session = driver.session();
        var subjectDomainname = subject.domainname;
        var subjectNodeType = subject.nodetype;
        var subjectNodeName = subject.nodename;
        var objectNodeType = subject.nodetype1;
        var objectNodeName = subject.nodename1;

        query = 'match (s:' + subjectNodeType + '{name:{subjectNodeName}})<-[r*]-(o:' + objectNodeType + '{name:{objectNodeName}})'
        query += 'return s, r, o'
        params = {
            subjectNodeType: subjectNodeType,
            subjectNodeName: subjectNodeName,
            objectNodeType: objectNodeType,
            objectNodeName: objectNodeName
        }
        session.run(query, params).then(function(result) {
                if (result) {
                    logger.debug(result);
                }
                session.close();
                resolve(result);
            })
            .catch(function(error) {
                logger.error("Error in deleting the query: ", error, ' query is: ', query);
                reject(error);
            });
    });
    return promise;
};

let getPublishAddNodeCallback = function(subject, object, callback) {
    getPublishAddNode(subject, object).then(function(nodename) {
        callback(null, nodename);
    }, function(err) {
        callback(err, null);
    });
};

let deleteOrphansCallback = function(deleteObj, callback) {
    logger.debug("In the callback ", deleteObj);
    deleteOrphans(deleteObj).then(function(result) {
            callback(null, result);
        },
        function(error) {
            callback(error, null);
        });
};

let getAllRelationsCallback = function(subject, callback) {
    logger.debug("from the callback : " + subject.nodename);
    getAllRelations(subject).then(function(nodename) {
        callback(null, nodename);
    }, function(err) {
        callback(err, null);
    });
};

let getRelationsCallback = function(subject, callback) {
    logger.debug("from the callback : " + subject.nodename);
    getRelations(subject).then(function(nodename) {
        callback(null, nodename);
    }, function(err) {
        callback(err, null);
    });
};

module.exports = {
    getPublishAddNodeCallback: getPublishAddNodeCallback,
    deleteOrphansCallback: deleteOrphansCallback,
    getRelationsCallback: getRelationsCallback,
    getAllRelationsCallback: getAllRelationsCallback
};
