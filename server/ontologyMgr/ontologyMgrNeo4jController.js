const neo4jDriver = require('neo4j-driver').v1;
const logger = require('./../../applogger');
const config = require('./../../config');
const graphConsts = require('./../common/graphConstants');
let cypher = require('cypher-stream')(config.NEO4J.neo4jURL, config.NEO4J.usr,
    config.NEO4J.pwd);
let fs = require('fs');

//Code for : Generalized adding for Concept,Intent and Term with Predicate
//Developer : Kowsikan

let getPublishAddNode = function(subject, object) {

    logger.debug(subject.nodename);

    let promise = new Promise(function(resolve, reject) {

        logger.debug("Now proceeding to publish subject: ", subject.nodeName);

        let driver = neo4jDriver.driver(config.NEO4J.neo4jURL,
            neo4jDriver.auth.basic(config.NEO4J.usr, config.NEO4J.pwd), {
                encrypted: false
            }
        );

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

let getPublishAddNodeCallback = function(subject, object, callback) {

    logger.debug("from the callback : " + subject.nodename);

    getPublishAddNode(subject, object).then(function(nodename) {
        callback(null, nodename);
    }, function(err) {
        callback(err, null);
    });
};

module.exports = {
    getPublishAddNodeCallback: getPublishAddNodeCallback
};
