const neo4jDriver = require('neo4j-driver').v1;
const logger = require('./../../applogger');
const config = require('./../../config');
const graphConsts = require('./../common/graphConstants');

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

let deleteObjectCallback = function(deleteObj, callback) {
    logger.debug("from the callback : ", deleteObj.objNodeName);
    deleteObject(deleteObj).then(function(result) {
        callback(null, result);
    }, function(err) {
        callback(err, null);
    });
};

module.exports = {
    deleteObjectCallback: deleteObjectCallback
};
