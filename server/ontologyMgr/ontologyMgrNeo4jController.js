const neo4jDriver = require('neo4j-driver').v1;
const logger = require('./../../applogger');
const config = require('./../../config');
const graphConsts = require('./../common/graphConstants');

let getPublishAddNode = function(subject, object) {
    logger.debug(subject.nodeName);
    let promise = new Promise(function(resolve, reject) {
        logger.debug("Now proceeding to publish subject: ", subject.nodeName);
        let driver = neo4jDriver.driver(config.NEO4J.neo4jURL,
            neo4jDriver.auth.basic(config.NEO4J.usr, config.NEO4J.pwd), {
                encrypted: false
            });

        let session = driver.session();
        logger.debug("obtained connection with neo4j");
        var predicateWeight = '';
        var subjectDomainname = subject.domainName;
        var subjectNodeType = subject.nodeType;
        var subjectNodeName = subject.nodeName;

        var attributesVar = '';

        for (k in object.attributes) {
            // logger.debug(k);
            // logger.debug(object.attributes[k]);
            attributesVar = attributesVar + ',' + k + ':"' + object.attributes[k] + '"';
        }

        attributesVar = attributesVar.substr(1, attributesVar.length - 1);
        attributesVar = '{' + attributesVar + '}'
        logger.debug(attributesVar);

        let query = '';
        let params = {};

        for (var i = 0; i < object.objects.length; i++) {

            objectURL = object.objects[i].name;
            splitArray = objectURL.split('/');
            logger.debug(objectURL);
            var objectDomainname = splitArray[2];
            var objectNodeType = splitArray[4];
            var objectNodeName = splitArray[5];

            for (j = 0; j < object.objects[i].predicates.length; j++) {
                var predicateName = object.objects[i].predicates[j].name;
                var predicateDirection = object.objects[i].predicates[j].direction;

                logger.debug(predicateName);
                logger.debug(predicateDirection);

                if (objectNodeType == graphConsts.NODE_TERM && predicateName == graphConsts.REL_INDICATOR_OF) {
                    predicateWeight = '{weight:5}';
                } else if (objectNodeType == graphConsts.NODE_TERM && predicateName == graphConsts.REL_COUNTER_INDICATOR_OF) {
                    predicateWeight = '{weight:-5}';
                }

                if (predicateDirection == 'O') {
                    var temp = '';
                    temp = objectNodeName;
                    objectNodeName = subjectNodeName;
                    subjectNodeName = temp;
                    temp = objectNodeType;
                    objectNodeType = subjectNodeType;
                    subjectNodeType = temp;
                }

                //Query Area

                query = 'merge (s:' + subjectNodeType + '{name:{subjectNodeName}})'
                query += ' merge(o:' + objectNodeType + '{name:{objectNodeName}})'
                query += ' merge(o)-[r:' + predicateName + ']->(s)'
                query += ' return r'

                params = {
                    subjectNodeName: subjectNodeName,
                    objectNodeName: objectNodeName
                };

                logger.debug(params.subjectNodeName);
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

let deleteObject = function(deleteObj) {
    let subType = deleteObj.subNodeType.toLowerCase(),
        sub = subType.charAt(0),
        objType = deleteObj.objNodeType.toLowerCase(),
        obj = objType.charAt(0);

    let promise = new Promise(function(resolve, reject) {
        logger.debug("Now proceeding to delete " +
            "the Object ", deleteObj.objNodeName);
        let driver = neo4jDriver.driver(config.NEO4J.neo4jURL,
            neo4jDriver.auth.basic(config.NEO4J.usr, config.NEO4J.pwd), {
                encrypted: false
            });
        let session = driver.session();
        logger.debug("Obtained connection with neo4j");
        let query = 'match(d:Domain{name:{domainName}})'
        query += 'match(d)<-[r1]-(' + sub + ':' + deleteObj.subNodeType + '{name:{subNodeName}})'
        query += 'match(' + sub + ')<-[r2:' + deleteObj.predicateName + ']-(' + obj + ':' + deleteObj.objNodeType + '{name:{objNodeName}})'
        query += 'detach delete(r2)';

        let params = {
            domainName: deleteObj.domainName,
            subNodeName: deleteObj.subNodeName,
            objNodeName: deleteObj.objNodeName
        };

        session.run(query, params)
            .then(function(result) {
                if (result) {
                    session.close();
                    resolve(deleteObj.objNodeName);
                }
            })
            .catch(function(err) {
                logger.error("Error in the query: ", err, ' query is: ',
                    query);
                reject(err);
            });
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
        //MATCH (:Intent { name: 'functions' })-[r :IndicatorOf]->(:Term {name:"jsf"})
        //RETURN (r)
        // for all
        // MATCH (x:Test)-[r:CONNECTED_TO*]->(z:Test)
        // RETURN x, r, z
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
    logger.debug("from the callback : " + subject.nodename);
    getPublishAddNode(subject, object).then(function(nodename) {
        callback(null, nodename);
    }, function(err) {
        callback(err, null);
    });
};

let deleteObjectCallback = function(deleteObj, callback) {
    logger.debug("from the callback : ", deleteObj.objNodeName);
    deleteObject(deleteObj).then(function(result) {
        callback(null, result);
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

let getRelationsCallback = function(subject, callback) {
    logger.debug("from the callback : " + subject.nodename);
    getRelations(subject).then(function(nodename) {
        callback(null, nodename);
    }, function(err) {
        callback(err, null);
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

module.exports = {
    deleteObjectCallback: deleteObjectCallback,
    deleteOrphansCallback: deleteOrphansCallback,
    getRelationsCallback: getRelationsCallback,
    getAllRelationsCallback: getAllRelationsCallback,
    getPublishAddNodeCallback: getPublishAddNodeCallback
};
