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
        let driver = neo4jDriver.driver(config.NEO4J.neo4jURL,
            neo4jDriver.auth.basic(config.NEO4J.usr, config.NEO4J.pwd), {
                encrypted: false
            }
        );

        let session = driver.session();

        logger.debug("obtained connection with neo4j");
            let query = 'MATCH (d:' + graphConsts.NODE_DOMAIN +
                '{name:{nodeName}})-[]-(c) return distinct  c';
            let params = {
                nodeName: nodeObj.name
            };

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
                      }
                      getSubjectObjects(node).then(function(result){
                        //logger.debug("The returned result from getSubjectObjects promise callback for success: ", result);
                        //domain.push(result);
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
    }, function(err) {
        callback(err, null);
    });
};

module.exports = {
  getAllDomainDetailsCallback: getAllDomainDetailsCallback,
  getSubjectObjectsCallback: getSubjectObjectsCallback
}
