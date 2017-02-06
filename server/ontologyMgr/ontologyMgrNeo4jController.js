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


            // MATCH (i:Intent)-[r]-(allRelatedNodes)
            // WHERE i.name = "Athletics"
            // AND size((allRelatedNodes)--()) = 1
            // DETACH DELETE i, allRelatedNodes
            //

            // match (i:Intent{name:"Athletics"})<-[r]-(allRelatedNodes)
            //
            // where i.name = "Athletics" AND size((allRelatedNodes)--()) = (count(r)-(count(r)-1))
            // DETACH DELETE i, allRelatedNodes




        }
         else {
           query += 'match (s:' + deleteObj.nodeType + ')<-[r]-(allRelatedNodes)'
           query += 'WHERE s.name = {nodeName}'
           query += 'detach delete s';

           params = {
               // nodeType: nodetype,
               nodeName: deleteObj.nodeName
           };
           }


        //
        //     params = {
        //         domainName: domainName,
        //         nodeType: nodetype,
        //         nodeName: nodeName
        //     };
        // }
        logger.debug("Query ", query);
        session.run(query, params).then(function(result) {
                logger.debug(result);
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

module.exports = {
    deleteOrphansCallback: deleteOrphansCallback,
};
