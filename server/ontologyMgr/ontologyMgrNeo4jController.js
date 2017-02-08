const neo4jDriver = require('neo4j-driver').v1;
const logger = require('./../../applogger');
const config = require('./../../config');
const graphConsts = require('./../common/graphConstants');

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
            logger.debug(deleteObj.nodeName);
            let driver = neo4jDriver.driver(config.NEO4J.neo4jURL,
                neo4jDriver.auth.basic(config.NEO4J.usr, config.NEO4J.pwd), {
                    encrypted: false
                });
            let session = driver.session();
            logger.debug("obtained connection with neo4j");

            let query = '';
            let params = {};
            if (parseInt(deleteObj.cascade) == 1) {






                query += 'match (s:' + deleteObj.nodeType + ')-[r]-(allRelatedNodes)'
                query += 'WHERE s.name = {nodeName}'
                query += 'AND size((allRelatedNodes)--()) = 1 '
                query += 'DETACH DELETE allRelatedNodes,s';
                params = {
                    nodeName: deleteObj.nodeName
                };


                // MATCH (i:Intent)-[r]-(allRelatedNodes)
                // WHERE i.name = "Athletics"
                // AND size((allRelatedNodes)--()) = 1
                // DETACH DELETE i, allRelatedNodes
                //

                // match (i:Intent{name:"Athletics"})<-[r]-(allRelatedNodes)
                //
                // where i.name = "Athletics" AND size((allRelatedNodes)--()) = (count(r)-(count(r)-1))
                // DETACH DELETE i, allRelatedNodes




            } else {
                query += 'match (s:' + deleteObj.nodeType + ' {name : {nodeName}})'
                query += 'detach delete s return count(s)';

                params = {
                    nodeName: deleteObj.nodeName
                };
            }
            session.run(query, params).then(function(result) {
                    logger.debug(result);
                    session.close();
                    resolve(result.summary.counters);
                })
                .catch(function(error) {
                    logger.error("Error in query: ", error, ' query is: ', query);
                    reject(error);
                });

        });
        return promise;
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

let getRelationsCallback = function(subject, callback) {
    logger.debug("from the callback : " + subject.nodename);
    getRelations(subject).then(function(nodename) {
        callback(null, nodename);
    }, function(err) {
        callback(err, null);
    });
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

module.exports = {
    deleteOrphansCallback: deleteOrphansCallback,
    getRelationsCallback: getRelationsCallback,
    getAllRelationsCallback: getAllRelationsCallback
};
