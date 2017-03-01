const neo4jDriver = require('neo4j-driver').v1;
const logger = require('./../../applogger');
const config = require('./../../config');
const graphConsts = require('./../common/graphConstants');

let cypher = require('cypher-stream')(config.NEO4J.neo4jURL, config.NEO4J.usr,
    config.NEO4J.pwd);
let fs = require('fs');

let getAllDomainDetails = function(nodeObj) {

    let promise = new Promise(function(resolve, reject) {
        logger.debug('Now proceeding to retrive objects for node name: ',
            nodeObj.name);
        let driver = neo4jDriver.driver(config.NEO4J.neo4jURL,
            neo4jDriver.auth.basic(config.NEO4J.usr, config.NEO4J.pwd), {
                encrypted: false
            }
        );

        let session = driver.session();
        logger.debug('obtained connection with neo4j');
        let query = 'MATCH (d:' + graphConsts.NODE_DOMAIN +
            '{name:{nodeName}})-[r]-(c) return d as Domain,type(r) as Relation,c as RelNodes';
        let params = {
            nodeName: nodeObj.name
        };

        let obj = {
            attributes: null,
            subjects: []
        };
        session.run(query, params)
            .then(function(result) {
                if (result.records.length == 0) {
                    resolve({
                        error: 'No Domain/No related intents or concepts'
                    });
                }
                result.records.forEach(function(record) {
                    if (obj.attributes === null) {
                        obj.attributes = record._fields[0]['properties'];
                    }
                    if (obj['subjects'].length == 0) {
                        let tempObj = {
                            name: record._fields[2]['properties']['name'],
                            attributes: record._fields[2]['properties'],
                            label: record._fields[2]['labels'][0],
                            predicates: [record._fields[1]]
                        };
                        obj.subjects.push(tempObj);
                    } else {
                        let found = false;
                        for (let each in obj.subjects) {
                            if (obj.subjects[each]['name'] == record._fields[2]['properties']['name']) {
                                obj.subjects[each]['predicates'].push(record._fields[1]);
                                found = true;
                                break;
                            }
                        }
                        if (!found) {
                            let tempObj = {
                                name: record._fields[2]['properties']['name'],
                                attributes: record._fields[2]['properties'],
                                label: record._fields[2]['labels'][0],
                                predicates: [record._fields[1]]
                            }
                            obj.subjects.push(tempObj);
                        }
                    }
                });
                session.close();
                resolve(obj);
            })
            .catch(function(err) {
                logger.error('Error in neo4j query: ', err, ' query is: ',
                    query);
                reject(err);
            });
    });
    return promise;
}

let getPublishAddNode = function(subject, object) {

    logger.debug(subject.nodeName);
    let promise = new Promise(function(resolve, reject) {
        logger.debug('Now proceeding to publish subject: ', subject.nodeName);

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
        var relationWithDirectionAndWeight = '';

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

                if (objectNodeType == graphConsts.NODE_TERM) {
                    predicateWeight = '{weight:1}';
                }

                if (predicateDirection == 'I') {

                    relationWithDirectionAndWeight = '-[r:' + predicateName + predicateWeight + ']->'

                } else if (predicateDirection == 'O') {

                    relationWithDirectionAndWeight = '<-[r:' + predicateName + predicateWeight + ']-'

                } else {
                    relationWithDirectionAndWeight = '-[r:' + predicateName + predicateWeight + ']->'

                }

                if (subjectNodeType == graphConsts.NODE_DOMAIN) {
                    query = 'merge (s:' + subjectNodeType + '{name:{subjectNodeName}})'
                    query += ' merge(o:' + objectNodeType + '{name:{objectNodeName}' + attributesVar + '})'
                    query += ' merge(o)' + relationWithDirectionAndWeight + '(s)'
                    query += ' return r'
                } else {
                    query = 'match (s:' + subjectNodeType + '{name:{subjectNodeName}})-[]-(d:Domain{name:{subjectDomainname}})'
                    query += ' merge(o:' + objectNodeType + '{name:{objectNodeName}' + attributesVar + '})'
                    query += ' merge(o)' + relationWithDirectionAndWeight + '(s)'
                    query += ' return r'
                }



                params = {
                    subjectDomainname: subjectDomainname,
                    subjectNodeName: subjectNodeName,
                    objectNodeName: objectNodeName
                };

                logger.debug(params.subjectNodeName);
                session.run(query, params).then(function(result) {
                        if (result) {
                            logger.debug(result);
                        }
                        session.close();
                        resolve('Added');
                    })
                    .catch(function(error) {
                        logger.error('Error in NODE_CONCEPT query: ', error, ' query is: ', query);
                        reject(error);
                    });
            }
        }
    });
    return promise;
};

let getSubjectObjects = function(nodeObj) {
    let promise = new Promise(function(resolve, reject) {
        logger.debug('Now proceeding to retrive objects for node name: ',
            nodeObj.nodename);
        let driver = neo4jDriver.driver(config.NEO4J.neo4jURL,
            neo4jDriver.auth.basic(config.NEO4J.usr, config.NEO4J.pwd), {
                encrypted: false
            }
        );

        let session = driver.session();
        let query = '';
        let params = {};
        logger.debug('obtained connection with neo4j');
        if (nodeObj.nodetype == 'concept') {
            query = 'MATCH (d:' + graphConsts.NODE_DOMAIN +
                '{name:{nodeName}})-[r]-(c:Concept {name:{conceptName}})-[r1]-(c1:Concept) return c as Concept,type(r1) as Relation,c1 as RelConcepts';
            params = {
                nodeName: nodeObj.domainname,
                conceptName: nodeObj.nodename
            };
        }
        if (nodeObj.nodetype == 'intent') {
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
                    if (obj.attributes === null) {

                        obj.attributes = record._fields[0]['properties'];
                    }
                    if (obj['objects'].length == 0) {
                        let tempObj = {
                            name: record._fields[2]['properties']['name'],
                            predicates: [record._fields[1]]
                        };
                        obj.objects.push(tempObj);
                    } else {
                        let found = false;
                        for (let each in obj.objects) {
                            if (obj.objects[each]['name'] == record._fields[2]['properties']['name']) {
                                if(obj.objects[each]['predicates'].indexOf(record._fields[1]) < 0){
                                  obj.objects[each]['predicates'].push(record._fields[1]);
                                }
                                found = true;
                                break;
                            }
                        }
                        if (!found) {
                            let tempObj = {
                                name: record._fields[2]['properties']['name'],
                                predicates: [record._fields[1]]
                            }
                            obj.objects.push(tempObj);
                        }
                    }
                });
                session.close();
                //resolve(result);
                resolve(obj);
            })
            .catch(function(err) {
                logger.error('Error in neo4j query: ', err, ' query is: ',
                    query);
                reject(err);
            });
    });
    return promise;
}
let getSubjectObjectsCallback = function(nodeObj, callback) {
    getSubjectObjects(nodeObj).then(function(retrievedObjects) {
        callback(null, retrievedObjects);
    }, function(err) {
        callback(err, null);
    });
}

let getSearchCallback = function(nodeObj, callback) {
    getSearch(nodeObj).then(function(retrievedObjects) {
        callback(null, retrievedObjects);
    }, function(err) {
        callback(err, null);
    });
}

let getAllDomainDetailsCallback = function(nodeObj, callback) {
    logger.debug('from the callback : ' + nodeObj)
    getAllDomainDetails(nodeObj).then(function(retrievedObjects) {
        callback(null, retrievedObjects);
    }, function(err) {
        callback(err, null);
    });
}

let deleteObject = function(deleteObj) {
    // let subType = deleteObj.subNodeType.toLowerCase(),
    //     sub = subType.charAt(0),
    //     objType = deleteObj.objNodeType.toLowerCase(),
    //     obj = objType.charAt(0);

    let promise = new Promise(function(resolve, reject) {
        logger.debug('Now proceeding to delete ' +
            'the Object ', deleteObj.objNodeName);
        let driver = neo4jDriver.driver(config.NEO4J.neo4jURL,
            neo4jDriver.auth.basic(config.NEO4J.usr, config.NEO4J.pwd), {
                encrypted: false
            });
        let session = driver.session();
        logger.debug('Obtained connection with neo4j');
        // let query = 'match(d:Domain{name:{domainName}})'
        // query += 'match(d)<-[r1]-( sub:' + deleteObj.subNodeType + '{name:{subNodeName}})'
        // query += 'match(sub)-[r2:' + deleteObj.predicateName + ']-(obj:' + deleteObj.objNodeType + '{name:{objNodeName}})'
        // query += 'detach delete(r2)';

        let query = 'match(d:Domain{name:{domainName}})'
        query += 'match(d)<-[r1]-( sub:' + deleteObj.subNodeType + '{name:{subNodeName}})'
        query += 'match(sub)<-[r2:' + deleteObj.predicateName + ']-(obj:' + deleteObj.objNodeType + '{name:{objNodeName}})'
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
                    resolve(deleteObj);
                }
            })
            .catch(function(err) {
                logger.error('Error in the query: ', err, ' query is: ',
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
        logger.info('Now proceeding to delete the orphaned node:',
            deleteObj
        );
        logger.info('nodeRef is',
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
        logger.debug('obtained connection with neo4j');
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
                logger.error('Error in query: ', error, ' query is: ', query);
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
        logger.debug('obtained connection with neo4j');
        logger.debug('subject', subject.predicates)
        var subjectDomainname = subject.domainname;
        var subjectNodeType = subject.nodetype;
        var subjectNodeName = subject.nodename;
        var objectNodeType = subject.nodetype1;
        var objectNodeName = subject.nodename1;
        var predicateName = subject.predicates;
        // MATCH (:Person { name: 'Oliver Stone' })-->(movie)
        // RETURN movie.title
        query = 'match (s:' + subjectNodeType + '{name: {subjectNodeName}})-[r:' + predicateName + ']-(o:' + objectNodeType + '{name:{objectNodeName}})'
        query += 'return r'
        params = {
            subjectNodeName: subjectNodeName,
            objectNodeName: objectNodeName,
            subjectNodeType: subjectNodeType,
            objectNodeType: objectNodeType,
            predicateName: predicateName
        };
        //  logger.debug('subjectNodeName', params.subjectNodeName)
        session.run(query, params).then(function(result) {
                if (result) {
                    logger.debug(result);
                }
                session.close();
                resolve(result); //result.records[0]._fields[0]['properties']
            })
            .catch(function(error) {
                logger.error('Error in query: ', error, ' query is: ', query);
                reject(error);
            });
    });
    return promise;
};

//Yogee part of modifying attributes
let getPublishSubjectObjectAttributes = function(editTermRelation) {
    let subjectName = editTermRelation.subjectName;
    let objectName = editTermRelation.objectName;
    let relationName = editTermRelation.relationName;
    let nodetype1 = editTermRelation.subjectType;
    let nodetype2 = editTermRelation.objectType;


    logger.debug(relationName);
    let promise = new Promise(function(resolve, reject) {
        logger.debug(
            'Now proceeding to publish the edited intent term relation: ',
            editTermRelation.relationName);
        let driver = neo4jDriver.driver(config.NEO4J.neo4jURL,
            neo4jDriver.auth.basic(config.NEO4J.usr, config.NEO4J.pwd), {
                encrypted: false
            }
        );

        let session = driver.session();

        logger.debug('obtained connection with neo4j');

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
            props: editTermRelation.attributes
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
                logger.error('Error in NODE_CONCEPT query: ', error, ' query is: ', query);
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
        //Check *
        query = 'match (s:' + subjectNodeType + '{name:{subjectNodeName}})<-[r]-(o:' + objectNodeType + '{name:{objectNodeName}})'
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
                logger.error('Error in deleting the query: ', error, ' query is: ', query);
                reject(error);
            });
    });
    return promise;
};
// Getting all the orphans
let getAllOrphans = function(subject) {
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
        query = 'MATCH (c:' + subjectNodeType + ')-[r]-(allRelatedNodes) WHERE c.name = {subjectNodeName} AND size((allRelatedNodes)--()) >= 1'
        query += ' return allRelatedNodes, size((allRelatedNodes)--()) as Count';
        params = {
            subjectNodeType: subjectNodeType,
            subjectNodeName: subjectNodeName
        }
        session.run(query, params).then(function(result) {
                if (result) {
                    let orphanNodes = [];
                    result.records.forEach(function(record) {
                        let obj = {
                            name: null,
                            label: null,
                            count: null
                        }
                        obj.name = record._fields[0]['properties']['name'];
                        obj.label = record._fields[0]['labels'][0];
                        obj.count = record._fields[1]['low'];
                        orphanNodes.push(obj);
                    });
                    session.close();
                    resolve(orphanNodes);
                }
            })
            .catch(function(error) {
                logger.error('Error in deleting the query: ', error, ' query is: ', query);
                reject(error);
            });
    });
    return promise;
};

let deleteDomain = function(domain) {
    var neo4j = require('neo4j-driver').v1;
    var driver = neo4j.driver('bolt://localhost', neo4j.auth.basic('neo4j',
        'password'));
    var session = driver.session();
    console.log(session);
    var params = {
        domainName: domain.domainName
    };
    session.run('MATCH (n:' + graphConsts.NODE_DOMAIN +
            '{name:{domainName}}) DETACH DELETE n', params)
        .subscribe({
            onNext: function(records) {
                console.log(records);
            },
            onCompleted: function() {
                console.log('COmpleted');
            },
            onError: function(err) {
                console.log(err);
            }
        });
}

let getPublishAddNodeCallback = function(subject, object, callback) {
    logger.debug('from the callback : ' + subject.nodename);
    getPublishAddNode(subject, object).then(function(nodename) {
        callback(null, nodename);
    }, function(err) {
        callback(err, null);
    });
};

let deleteObjectCallback = function(deleteObj, callback) {
    logger.debug('from the callback : ', deleteObj.objNodeName);
    deleteObject(deleteObj).then(function(result) {
        callback(null, result);
    }, function(err) {
        callback(err, null);
    });
};

let deleteOrphansCallback = function(deleteObj, callback) {
    logger.debug('In the callback ', deleteObj);
    deleteOrphans(deleteObj).then(function(result) {
            callback(null, result);
        },
        function(error) {
            callback(error, null);
        });
};

let getRelationsCallback = function(subject, callback) {
    logger.debug('from the callback : ' + subject.nodename);
    getRelations(subject).then(function(nodename) {
        callback(null, nodename);
    }, function(err) {
        callback(err, null);
    });
};

let getAllRelationsCallback = function(subject, callback) {
    logger.debug('from the callback : ' + subject.nodename);
    getAllRelations(subject).then(function(nodename) {
        callback(null, nodename);

    }, function(err) {
        callback(err, null);
    });
};

let getAllOrphansCallback = function(subject, callback) {
    logger.debug('from the callback : ' + subject.nodename);
    getAllOrphans(subject).then(function(nodename) {
        callback(null, nodename);
    }, function(err) {
        callback(err, null);
    });
};

let getPublishSubjectObjectAttributesCallback = function(editTermRelation, callback) {
    logger.debug('from the callback : ' + editTermRelation.subjectName);
    getPublishSubjectObjectAttributes(editTermRelation).then(function(termRelationDetails) {
        callback(null, termRelationDetails);
    }, function(err) {
        callback(err, null);
    });
};


let modifySubjectProperties = function(subject) {
    let promise = new Promise(function(resolve, reject) {
        logger.info('Now proceeding to modify properties for subject name', subject.nodename);
        let driver = neo4jDriver.driver(config.NEO4J.neo4jURL,
            neo4jDriver.auth.basic(config.NEO4J.usr, config.NEO4J.pwd), {
                encrypted: false
            }
        );
        let query = 'match (s:' + subject.nodetype + '{name:{nodename}})'
        query += 'set s += {props}'
        query += 'return s';
        let params = {
            nodename: subject.nodename,
            props: subject.properties
        }

        let session = driver.session();
        session.run(query, params).then(function(result) {
                if (result) {
                    logger.debug(result);
                }
                session.close();
                if (result.records.length > 0) {
                    resolve({
                        properties: result.records[0]._fields[0]['properties']
                    });
                } else {
                    reject({
                        error: 'No such node'
                    });
                }
            })
            .catch(function(error) {
                logger.error('Error in EDIT properties query: ', error, ' query is: ', query);
                reject(false);
            });
    });
    return promise;
}

let modifySubjectPropertiesCallback = function(subject, callback) {
    logger.debug('from the callback : ' + subject);
    modifySubjectProperties(subject).then(function(result) {
        callback(null, result);
    }, function(err) {
        callback(err, null);
    });
}

let getSearch = function(nodeObj) {
    let promise = new Promise(function(resolve, reject) {
        logger.debug('Now proceeding to retrive objects for node name: ',
            nodeObj.name);
        let driver = neo4jDriver.driver(config.NEO4J.neo4jURL,
            neo4jDriver.auth.basic(config.NEO4J.usr, config.NEO4J.pwd), {
                encrypted: false
            }
        );
        var subjectDomainname = nodeObj.domainname;
        let session = driver.session();
        let query = '';
        logger.debug('obtained connection with neo4j');
        //  let query = 'match (n) where n.name =~ {search} return n';

        let listDetail = [];
        query = 'match (d: Domain {name: {subjectDomainname}})-[r]-(n)-[r1]-(p) return p , n,r,r1';
        let params = {
            subjectDomainname: subjectDomainname,
        };

        session.run(query, params)
            .then(function(result) {
                if (result.records.length == 0) {
                // console.log('inside if statement');
                } else {

                    result.records.forEach(function(record) {
                        let obj = {
                            name: null,
                            label: null,
                            type: null,
                            type1: null
                        }
                        obj.name = record._fields[0]['properties']['name'];
                        obj.label = record._fields[0]['labels'][0];
                        obj.type = record._fields[2]['type'];
                        obj.type1 = record._fields[3]['type'];


                        listDetail.push(obj);
                    });
                }
                session.close();
                resolve(listDetail);

            })
            .catch(function(err) {
                logger.error('Error in neo4j query: ', err, ' query is: ',
                    query);
                reject(err);
            });
    });
    return promise;
};


let createResource = function(nodeObj) {
    let promise = new Promise(function(resolve, reject) {
        logger.debug('Now proceeding to retrive objects for node name: ',
            nodeObj.name);
        let driver = neo4jDriver.driver(config.NEO4J.neo4jURL,
            neo4jDriver.auth.basic(config.NEO4J.usr, config.NEO4J.pwd), {
                encrypted: false
            }
        );
        let domainName = nodeObj.domainname;
        let subname = nodeObj.resourceDetails['subname'];
        let subtype = nodeObj.resourceDetails['subtype'];
        let props = nodeObj.resourceDetails['attributes'];
        let defaultPredicate = null;
        if (nodeObj.resourceDetails['subtype'] == 'Intent') {
            defaultPredicate = 'IntentOf';
        } else {
            defaultPredicate = 'ConceptOf';
        }
        let session = driver.session();
        let query = '';
        logger.debug('obtained connection with neo4j');
        //  let query = 'match (n) where n.name =~ {search} return n';
        query = 'match (d:Domain {name:{domainName}})'
        query += ' merge (s:'+ subtype+' {name:{subname}})'
        query += ' merge (s)-[r:'+ defaultPredicate +']->(d)'
        query += ' set s = {props}'
        query += ' return s';
        let params = {
            domainName: domainName,
            subtype: subtype,
            subname: subname,
            defaultPredicate: defaultPredicate,
            props: props
        };
        session.run(query, params)
            .then(function(result) {
                session.close();
                if (result.records.length == 0) {
                    resolve({
                        err: 'No Domain'
                    });
                } else {
                    resolve({
                        name: result.records[0]['_fields'][0]['properties']['name']
                    });
                }
            })
            .catch(function(err) {
                logger.error('Error in neo4j query: ', err, ' query is: ',
                    query);
                reject(err);
            });
    });
    return promise;
};

let getPublishAllAttributes = function(subject) {
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

        query = 'match (s:' + subjectNodeType + '{name:{subjectNodeName}})-[r]-(o:' + objectNodeType + '{name:{objectNodeName}})'
        query += 'return s,o,r';
        params = {
            subjectNodeType: subjectNodeType,
            subjectNodeName: subjectNodeName,
            objectNodeType: objectNodeType,
            objectNodeName: objectNodeName
        };


        session.run(query, params).then(function(result) {
                if (result) {
                    logger.debug(result);
                }
                session.close();
                resolve(result.records[0]._fields[1]['properties']);
            })
            .catch(function(error) {
                logger.error('Error in deleting the query: ', error, ' query is: ', query);
                reject(error);
            });
    });
    return promise;
};

let getPublishAllAttributesCallback = function(subject, callback) {
    logger.debug('from the callback : ' + subject.nodename);
    getPublishAllAttributes(subject).then(function(nodename) {
        callback(null, nodename);

    }, function(err) {
        callback(err, null);
    });
};

let createResourceCallback = function(subject, callback) {
    logger.debug('from the callback : ' + subject);
    createResource(subject).then(function(result) {
        callback(null, result);
    }, function(err) {
        callback(err, null);
    });
};

let formStatement = function(nodeObj) {
    let promise = new Promise(function(resolve, reject) {
        logger.debug('Now proceeding to retrive objects for node name: ',
            nodeObj.name);
        let driver = neo4jDriver.driver(config.NEO4J.neo4jURL,
            neo4jDriver.auth.basic(config.NEO4J.usr, config.NEO4J.pwd), {
                encrypted: false
            }
        );
        let domainName = nodeObj.domainname;
        let subname = nodeObj['subname'];
        let subtype = nodeObj['subtype'];
        let objtype = nodeObj.resourceDetails['objtype'];
        let objname = nodeObj.resourceDetails['objname'];
        let objProps = nodeObj.resourceDetails['attributes'];
        let predicate = nodeObj.resourceDetails['predicate']['name'];
        let predicateProps = nodeObj.resourceDetails['predicate']['attributes'];
        let session = driver.session();
        let query = '';
        logger.debug('obtained connection with neo4j');
        query = ' match (s:'+ subtype+' {name:{subname}})'
        query += 'merge (o:'+ objtype+' {name:{objname}})'
        query += ' merge (o)-[r: '+ predicate +']->(s)'
        query += ' set r = {predicateProps}'
        query += ' set o = {objProps}'
        query += ' return o';
        let params = {
            domainName: domainName,
            subtype: subtype,
            subname: subname,
            objname: objname,
            objProps: objProps,
            predicateProps: predicateProps
        };
        session.run(query, params)
            .then(function(result) {
                session.close();
                if (result.records.length == 0) {
                    resolve({
                        err: 'No Subject'
                    });
                } else {
                    resolve(result.records[0]['_fields'][0]['properties']['name']);
                }
            })
            .catch(function(err) {
                logger.error('Error in neo4j query: ', err, ' query is: ',
                    query);
                reject(err);
            });
    });
    return promise;
};

let formStatementCallback = function(subject, callback) {
    logger.debug('from the callback : ' + subject);
    formStatement(subject).then(function(result) {
        callback(null, result);
    }, function(err) {
        callback(err, null);
    });
};

let getIntentOfDomain = function(data) {
    logger.debug('In ontologyMgrNeo4jController', data);
    let promise = new Promise(function(resolve, reject) {
        logger.debug('Start: tree structure of domain : ', data.domainName);
        let intents = [];
        let tree = {
            'name': data.domainName,
            'kids': [{
                'name': 'Intents',
                'kids': []
            }, {
                'name': 'Concepts',
                'kids': []
            }]
        };

        logger.debug('Data In getIntentOfDomain in Neo4j', data);
        cypher('match (d:' + graphConsts.NODE_DOMAIN +
                '{name:"' + data.domainName + '"})' +
                'match(d)-[]-(i:' + graphConsts.NODE_INTENT + ')-[]-(t:' + graphConsts.NODE_TERM + ')' +
                'return i.name as name, collect({name: t.name}) as kids'
            )
            .on('data', function(result) {
                tree.kids[0].kids.push(result);
            })
            .on('end', function() {
                logger.debug(tree);
            });

        cypher('match (d:' + graphConsts.NODE_DOMAIN +
                '{name:"' + data.domainName + '"})' +
                'match(d)-[]-(c:' + graphConsts.NODE_CONCEPT + ')-[]-(sc:' + graphConsts.NODE_CONCEPT + ')' +
                'return c.name as name, collect({name: sc.name}) as kids'
            )
            .on('data', function(result) {
                tree.kids[1].kids.push(result);
            })
            .on('end', function() {
                let p3 = JSON.stringify(tree);
                p3 = p3.replace('[', '[\n\t');
                p3 = p3.replace(/},/g, '},\n\t');
                p3 = p3.replace(/\\'/g, '');
                p3 = p3.replace(/,/g, ',\n\t');
                resolve(p3);
            });
    });
    return promise;
};

let getIntentOfDomainCallback = function(domain, callback) {
    logger.debug('from the getTree callback : ', domain);
    getIntentOfDomain(domain).then(function(indexedDomain) {
        callback(null, indexedDomain);
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
    getAllRelationsCallback: getAllRelationsCallback,
    getPublishSubjectObjectAttributesCallback: getPublishSubjectObjectAttributesCallback,
    modifySubjectPropertiesCallback: modifySubjectPropertiesCallback,
    getAllOrphansCallback: getAllOrphansCallback,
    getSearchCallback: getSearchCallback,
    createResourceCallback: createResourceCallback,
    formStatementCallback: formStatementCallback,
    getPublishAllAttributesCallback: getPublishAllAttributesCallback,
    getIntentOfDomainCallback: getIntentOfDomainCallback
};
