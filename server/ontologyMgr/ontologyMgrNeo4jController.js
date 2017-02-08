const neo4jDriver = require('neo4j-driver').v1;
const logger = require('./../../applogger');
const config = require('./../../config');
const graphConsts = require('./../common/graphConstants');

let cypher = require('cypher-stream')(config.NEO4J.neo4jURL, config.NEO4J.usr,
   config.NEO4J.pwd);
let fs = require('fs');

let getAllDomainDetails = function(nodeObj) {
    let promise = new Promise(function(resolve, reject) {

        logger.debug("Now proceeding to retrive objects for node name: ",
            nodeObj.name);

            logger.debug("obtained connection with neo4j");
                let query = 'MATCH (d:' + graphConsts.NODE_DOMAIN +
                    '{name:{nodeName}})-[]-(c) return distinct  c';
                let params = {
                    nodeName: nodeObj.name
                };
                logger.debug('query',query);
                let domain = [];
                session.run(query, params)
                    .then(function(result) {
                        result.records.forEach(function(record) {
                          logger.debug('asas', record._fields[0]['labels'][0].toLowerCase());
                          let nodetype = record._fields[0]['labels'][0].toLowerCase();
                          let nodename = record._fields[0]['properties']['name'];
                          let node = {
                            domainname: nodeObj.name,
                            nodetype: nodetype,
                            nodename: nodename
                          };
                          getSubjectObjects(node).then(function(result){
                            //logger.debug("The returned result from getSubjectObjects promise callback for success: ", result);
                            domain.push(result);
                          });
                        });
                        session.close();
                        resolve(domain);
                    })
                    .catch(function(err) {
                        logger.error("Error in neo4j query: ", err, ' query is: ',
                            query);
                        reject(err);
                    });
      });
      return promise;
    }

let getPublishAddNode = function(subject, object) {

    logger.debug(subject.nodeName);
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

            splitArray = object.objects[i].name.split('/');

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


let getSubjectObjects = function(nodeObj){
  let promise = new Promise(function(resolve, reject) {
      logger.debug("Now proceeding to retrive objects for node name: ",
          nodeObj.domainname);
      let driver = neo4jDriver.driver(config.NEO4J.neo4jURL,
          neo4jDriver.auth.basic(config.NEO4J.usr, config.NEO4J.pwd), {
              encrypted: false
          }
      );

      let session = driver.session();
      let query = '';
      let params = {};
      logger.debug("obtained connection with neo4j");
      if(nodeObj.nodetype == 'concept'){
        query = 'MATCH (d:' + graphConsts.NODE_DOMAIN +
            '{name:{nodeName}})-[r]-(c:Concept {name:{conceptName}})-[r1]-(c1:Concept) return c as Concept,type(r1) as Relation,c1 as RelConcepts';
        params = {
            nodeName: nodeObj.domainname,
            conceptName: nodeObj.nodename
        };
      }
      if(nodeObj.nodetype == 'intent'){
        query = 'MATCH (d:' + graphConsts.NODE_DOMAIN +
            '{name:{nodeName}})-[r]-(i:Intent {name:{intentName}})-[r1]-(t:Term) return i as Intent, type(r1) as Relation, t as RelIntents';
            params = {
                nodeName: nodeObj.domainname,
                intentName: nodeObj.nodename
            };
      }
      let obj = {
        attributes: null,
        objects: []
      };
      session.run(query, params)
          .then(function(result) {
              result.records.forEach(function(record) {
                if(obj.attributes == null){
                  obj.attributes = record._fields[0]['properties'];
                }
                if(obj['objects'].length == 0){
                  let tempObj = {
                    name : record._fields[2]['properties']['name'],
                    predicates: [record._fields[1]]
                  };
                  obj.objects.push(tempObj);
                }else{
                  let found = false;
                  for(let each in obj.objects){
                    if(obj.objects[each]['name'] == record._fields[2]['properties']['name']){
                      obj.objects[each]['predicates'].push(record._fields[1]);
                      found = true;
                      break;
                    }
                  }
                  if(!found){
                    let tempObj = {
                      name : record._fields[2]['properties']['name'],
                      predicates: [record._fields[1]]
                    }
                    obj.objects.push(tempObj);
                  }
                }
              });
              session.close();
              resolve(obj);
          })
          .catch(function(err) {
              logger.error("Error in neo4j query: ", err, ' query is: ',
                  query);
              reject(err);
          });
    });
    return promise;
}
let getSubjectObjectsCallback = function(nodeObj, callback){
  getSubjectObjects(nodeObj).then(function(retrievedObjects){
    callback(null, retrievedObjects);
    }, function(err) {
    callback(err, null);
  });
}

let getAllDomainDetailsCallback = function(nodeObj, callback) {
    logger.debug("from the callback : " + nodeObj)
    getAllDomainDetails(nodeObj).then(function(retrievedObjects) {
        callback(null, retrievedObjects);

        logger.debug("obtained connection with neo4j");
});
}

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
                resolve(result.records[0]._fields[0]['properties']['weight']);
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

  getAllDomainDetailsCallback: getAllDomainDetailsCallback,
  getSubjectObjectsCallback: getSubjectObjectsCallback,
    getPublishAddNodeCallback: getPublishAddNodeCallback,
    deleteObjectCallback: deleteObjectCallback,
    deleteOrphansCallback: deleteOrphansCallback,
    getRelationsCallback: getRelationsCallback,
    getAllRelationsCallback: getAllRelationsCallback
};
