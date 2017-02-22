const neo4jDriver = require('neo4j-driver').v1;

const logger = require('./../../applogger');

const config = require('./../../config');
const graphConsts = require('./../common/graphConstants');
//@todo change the neo4j connectiont config
// let cypher = require('cypher-stream')('bolt://localhost', 'neo4j', 'password');
let cypher = require('cypher-stream')(config.NEO4J.neo4jURL, config.NEO4J.usr,
    config.NEO4J.pwd);
let fs = require('fs');


let indexNewDomain = function(newDomainObj) {
    let promise = new Promise(function(resolve, reject) {

        logger.debug("Now proceeding to index new domain: ", newDomainObj);
        let driver = neo4jDriver.driver(config.NEO4J.neo4jURL,
            neo4jDriver.auth.basic(config.NEO4J.usr, config.NEO4J.pwd), {
                encrypted: false
            }
        );

        let session = driver.session();
        logger.debug("obtained connection with neo4j");

        let query = 'MERGE (d:' + graphConsts.NODE_DOMAIN +
            ' {name:{domainName}}) return d';
        let params = {
            domainName: newDomainObj.name
        };

        session.run(query, params)
            .then(function(result) {
                result.records.forEach(function(record) {
                    logger.debug("Result from neo4j: ", record);
                });

                // Completed!
                session.close();
                resolve(newDomainObj);
            })
            .catch(function(err) {
                logger.error("Error in neo4j query: ", err, ' query is: ',
                    query);
                reject(err);
            });
    });

    return promise;
}

let getAllDomainConcept = function(domainNameColln) {
    let promise = new Promise(function(resolve, reject) {

        logger.debug(
            "Now proceeding to retrieve the concepts for all domains: ");
        let driver = neo4jDriver.driver(config.NEO4J.neo4jURL,
            neo4jDriver.auth.basic(config.NEO4J.usr, config.NEO4J.pwd), {
                encrypted: false
            }
        );

        let session = driver.session();

        logger.debug("obtained connection with neo4j");
        let data = [];

        domainNameColln.forEach(function(domainName) {

            let query = 'MATCH (d:' + graphConsts.NODE_DOMAIN +
                '{name:{domainName}})'
            query += 'match(c:' + graphConsts.NODE_CONCEPT + ')'
            query += 'match(d)<-[r:' + graphConsts.REL_CONCEPT_OF +
                ']-(c)  RETURN d,count(c)';

            let params = {
                domainName: domainName
            };


            session.run(query, params)
                .then(function(result) {
                    result.records.forEach(function(record) {

                        let obj = {
                            Domain: "",
                            noOfConcepts: 0
                        }
                        record._fields.forEach(function(field) {
                            if (typeof field.low === 'undefined') {
                                obj.Domain = field.properties.name;
                            } else {
                                obj.noOfConcepts = field.low
                            }
                        });
                        data.push(obj);
                    });
                    if (data.length === domainNameColln.length) {
                        resolve(data);
                    }
                }).catch(function(err) {
                    logger.error("Error in neo4j query: ", err, ' query is: ',
                        query);
                    reject(err);
                });

        })

        // resolve(data);

    });

    return promise;
}


let getDomainConcept = function(domainName) {
    let promise = new Promise(function(resolve, reject) {

        logger.debug(
            "Now proceeding to retrive the concepts for domain name: ",
            domainName);
        let driver = neo4jDriver.driver(config.NEO4J.neo4jURL,
            neo4jDriver.auth.basic(config.NEO4J.usr, config.NEO4J.pwd), {
                encrypted: false
            }
        );

        let session = driver.session();

        logger.debug("obtained connection with neo4j");

        let query = 'MATCH (d:' + graphConsts.NODE_DOMAIN +
            '{name:{domainName}})'
        query += 'match(c:' + graphConsts.NODE_CONCEPT + ')'
        query += 'match(d)<-[r:' + graphConsts.REL_CONCEPT_OF +
            ']-(c) RETURN c';
        let params = {
            domainName: domainName
        };
        let concepts = [];
        session.run(query, params)
            .then(function(result) {
                result.records.forEach(function(record) {
                    record._fields.forEach(function(fields) {
                        concepts.push(fields.properties.name);
                    });

                });
                session.close();
                resolve({
                    Domain: domainName,
                    Concepts: concepts
                });
            })
            .catch(function(err) {
                logger.error("Error in NODE_INTENT query: ", err, ' query is: ',
                    query);
                reject(err);
            });
    });

    return promise;
}


let getDomainConceptWithDoc = function(domainName) {
    let promise = new Promise(function(resolve, reject) {

        logger.debug(
            "Now proceeding to retrive the concepts for domain name: ",
            domainName);
        let driver = neo4jDriver.driver(config.NEO4J.neo4jURL,
            neo4jDriver.auth.basic(config.NEO4J.usr, config.NEO4J.pwd), {
                encrypted: false
            }
        );

        let session = driver.session();

        logger.debug("obtained connection with neo4j");
        let query = 'MATCH (d:' + graphConsts.NODE_DOMAIN +
            '{name:{domainName}})'
        query += 'match(c:' + graphConsts.NODE_CONCEPT + ')'
        query += 'match(d)<-[r:' + graphConsts.REL_CONCEPT_OF + ']-(c) '
        query += 'match(w:' + graphConsts.NODE_WEBDOCUMENT + ')'
        query += 'match(c)<-[r1:' + graphConsts.REL_HAS_EXPLANATION_OF +
            ']-(w) '
        query += 'RETURN c.name,count(w)';
        let params = {
            domainName: domainName
        };
        let conceptsWithDoc = [];
        session.run(query, params)
            .then(function(result) {
                result.records.forEach(function(record) {
                    conceptsWithDoc.push(record._fields[0] + " (" + record._fields[
                        1] + " Docs)");
                });
                session.close();
                logger.debug({
                    Domain: domainName,
                    ConceptsWithDoc: conceptsWithDoc
                })
                resolve({
                    Domain: domainName,
                    ConceptsWithDoc: conceptsWithDoc
                });
            })
            .catch(function(err) {
                logger.error("Error in NODE_INTENT query: ", err, ' query is: ',
                    query);
                reject(err);
            });

    });

    return promise;
}


let getDomainIntent = function(domain) {
    let promise = new Promise(function(resolve, reject) {

        logger.debug("Now proceeding to retrive the intent for domain name: ",
            domain.Domain);
        let driver = neo4jDriver.driver(config.NEO4J.neo4jURL,
            neo4jDriver.auth.basic(config.NEO4J.usr, config.NEO4J.pwd), {
                encrypted: false
            }
        );

        let session = driver.session();

        logger.debug("obtained connection with neo4j");

        let query = 'MATCH (d:' + graphConsts.NODE_DOMAIN +
            '{name:{domainName}})'
        query += 'match(i:' + graphConsts.NODE_INTENT + ')'
        query += 'match(d)<-[r:' + graphConsts.REL_INTENT_OF +
            ']-(i) RETURN i';
        let params = {
            domainName: domain.Domain
        };
        let intents = [];
        session.run(query, params)
            .then(function(result) {
                result.records.forEach(function(record) {
                    record._fields.forEach(function(fields) {
                        intents.push(fields.properties.name);
                    });

                });
                session.close();
                domain.Intents = intents;
                logger.debug(domain);
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

let getDomainCardDetails = function(domainObj) {
    let promise = new Promise(function(resolve, reject) {
        logger.debug(" in domain card going for getting concepts for : ",
            domainObj);
        let driver = neo4jDriver.driver(config.NEO4J.neo4jURL,
            neo4jDriver.auth.basic(config.NEO4J.usr, config.NEO4J.pwd), {
                encrypted: false
            }
        );

        let session = driver.session();

        logger.debug("obtained connection with neo4j");

        let query = 'MATCH (d:' + graphConsts.NODE_DOMAIN +
            '{name:{domainName}})'
        query += 'match(c:' + graphConsts.NODE_CONCEPT + ')'
        query += 'match(d)<-[r:' + graphConsts.REL_CONCEPT_OF +
            ']-(c) RETURN c';
        let params = {
            domainName: domainObj
        };
        let concepts = [];
        session.run(query, params)
            .then(function(result) {
                result.records.forEach(function(record) {
                    //logger.debug("Result from neo4j: ", record);
                    record._fields.forEach(function(fields) {
                        // logger.debug("domain Concept :", fields.properties.name);
                        concepts.push(fields.properties.name);
                    });

                });
                //  domainObj['concepts']=concepts;
                //number of concepts calculated
                let query1 = 'MATCH (d:' + graphConsts.NODE_DOMAIN +
                    '{name:{domainName}})'
                query1 += 'MATCH (i:' + graphConsts.NODE_INTENT + ')'
                query1 += 'MATCH (d)<-[r:' + graphConsts.REL_INTENT_OF +
                    ']-(i) RETURN i';
                let params1 = {
                    domainName: domainObj
                };
                let intents = [];
                let intent = '';
                let documents = 0;
                let session1 = driver.session();
                session1.run(query1, params1)
                    .then(function(outerResults) {
                        outerResults.records.forEach(function(record) {
                            //logger.debug("Result from neo4j: ", record);
                            record._fields.forEach(function(fields) {
                                intent = fields.properties.name;
                                intents.push(intent);
                                logger.debug(" domain intent ", fields.properties
                                    .name);

                            });
                        });

                        // fetching intents Completed!

                        logger.debug("proceeding to fetch no of documents");
                        let query2 = 'MATCH (d:' + graphConsts.NODE_DOMAIN +
                            '{name:{domainName}})'
                        query2 += 'MATCH (c:' + graphConsts.NODE_CONCEPT + ')'
                        query2 += 'MATCH (w:' + graphConsts.NODE_WEBDOCUMENT +
                            ')'
                        query2 += 'match(d)<-[r:' + graphConsts.REL_CONCEPT_OF +
                            ']-(c)'
                        query2 += 'match(c)<-[r1:' + graphConsts.REL_HAS_EXPLANATION_OF +
                            ']-(w) RETURN w';
                        let params2 = {
                            domainName: domainObj
                        };
                        let session2 = driver.session();
                        session2.run(query2, params2)
                            .then(function(results) {
                                if (results.records.length === 0) {
                                    resolve({
                                        concepts: concepts,
                                        intents: intents,
                                        docs: documents
                                    });
                                } else {
                                    results.records.forEach(function(records) {
                                        records._fields.forEach(function() {
                                            // logger.debug('document is' + field.properties
                                            //  .name);
                                            documents += 1;
                                            // logger.debug(
                                            //   'Number is ++++++++++++++++^^^^^##### ' +
                                            //   documents);
                                        });
                                        // logger.debug('Number is  ' + documents);
                                    });
                                    resolve({
                                        concepts: concepts,
                                        intents: intents,
                                        docs: documents
                                    });
                                }
                                session2.close();

                            })
                            .catch(function(err) {
                                logger.error("Error in neo4j query: ", err,
                                    ' query is: ',
                                    query2);

                                //  reject(err);
                            });

                        session1.close();

                    })
                    .catch(function(err) {
                        logger.error("Error in neo4j query: ", err, ' query is: ',
                            query1);
                        reject(err);
                    });

                // Completed!
                session.close();
                //resolve({Domain:domainName,Concepts:concepts});
            })
            .catch(function(err) {
                logger.error("Error in neo4j query: ", err, ' query is: ',
                    query);
                reject(err);
            });
    });

    return promise;
}

let getIntentforDocument = function(domain) {
    let promise = new Promise(function(resolve, reject) {

        logger.debug("Now proceeding to retrive " +
            "the intent relationship: ", domain.domainObj.domainName);
        let driver = neo4jDriver.driver(config.NEO4J.neo4jURL,
            neo4jDriver.auth.basic(config.NEO4J.usr, config.NEO4J.pwd), {
                encrypted: false
            }
        );

        let session = driver.session();

        logger.debug("obtained connection with neo4j");
        let query = '';
        let str = JSON.stringify(domain.domainObj.allIntents);


        query += 'MATCH (d:' + graphConsts.NODE_DOMAIN +
            '{name:{domainName}})'
        query += 'MATCH(c:' + graphConsts.NODE_CONCEPT + ')'
        query += 'MATCH(d)<-[r1:' + graphConsts.REL_CONCEPT_OF + ']-(c)'
        query += 'MATCH(c)<-[r]-(w:' + graphConsts.NODE_WEBDOCUMENT +
            '{name:{docName}})';
        query += ' where type(r) in ' + str;
        query += 'return type(r),count(r)';

        let params = {
            domainName: domain.domainObj.domainName,
            docName: domain.docs
        };

        let intents = [];
        session.run(query, params)
            .then(function(result) {
                result.records.forEach(function(record) {
                    logger.debug("Result from neo4j: ", record);
                    let i = 0;
                    let obj = {};
                    record._fields.forEach(function(fields) {
                        i += 1;
                        if (i === 1) {
                            obj.intent = fields;
                        } else {
                            obj.count = Number(fields);
                            intents.push(obj);
                        }
                    });

                });
                session.close();
                resolve(intents);
            })
            .catch(function(err) {
                logger.error("Error in neo4j query: ", err, ' query is: ',
                    query);
                reject(err);
            });
    });

    return promise;
}

let getWebDocuments = function(domainObj) {
    let promise = new Promise(function(resolve, reject) {

        logger.debug("Now proceeding to retrive " +
            "the web Documents for domain name: ", domainObj.domainName);
        let driver = neo4jDriver.driver(config.NEO4J.neo4jURL,
            neo4jDriver.auth.basic(config.NEO4J.usr, config.NEO4J.pwd), {
                encrypted: false
            }
        );

        let session = driver.session();

        logger.debug("obtained connection with neo4j");
        let query = '';
        let str = JSON.stringify(domainObj.reqConcepts);
        let str1 = JSON.stringify(domainObj.reqIntents);
        // logger.debug("***********" + str + "     " + str1);
        if (domainObj.reqIntents.length === 0) {
            query += 'MATCH (d:' + graphConsts.NODE_DOMAIN +
                '{name:{domainName}})'
            query += 'match(c:' + graphConsts.NODE_CONCEPT + ')'
            query += 'match(d)<-[r1:' + graphConsts.REL_CONCEPT_OF + ']-(c)'
            query += 'MATCH (w:' + graphConsts.NODE_WEBDOCUMENT + ')';
            query += ' match(w)-[r]-(c) where c.name in ' + str;
            query += ' return w.name,sum(r.intensity) as sum order by sum desc';
        } else {
            query += 'MATCH (d:' + graphConsts.NODE_DOMAIN +
                '{name:{domainName}})'
            query += 'match (c:' + graphConsts.NODE_CONCEPT + ')'
            query += 'match(d)<-[r1:' + graphConsts.REL_CONCEPT_OF + ']-(c)'
            query += 'MATCH (w:' + graphConsts.NODE_WEBDOCUMENT + ')';
            query += 'match(w)-[r]-(c) where type(r) in ' + str1 +
                ' and c.name in ' + str;
            query += 'return w.name,sum(r.intensity) as sum order by sum desc';
        }
        let params = {
            domainName: domainObj.domainName
        };
        //logger.debug("query " + query);
        let docs = [];
        session.run(query, params)
            .then(function(result) {
                result.records.forEach(function(record) {
                    logger.debug("Result from neo4j: ", record);
                    let i = 0;
                    let obj = {};
                    record._fields.forEach(function(fields) {
                        i += 1;
                        if (i === 1) {
                            obj.url = fields;
                        } else {
                            obj.intensity = Number(fields);
                            docs.push(obj);
                        }
                    });

                });
                session.close();
                resolve(docs);
            })
            .catch(function(err) {
                logger.error("Error in neo4j query: ", err, ' query is: ',
                    query);
                reject(err);
            });
    });

    return promise;
}

let getTreeOfDomain = function(data) {
    logger.debug('domain ctrl', data);

    let promise = new Promise(function(resolve, reject) {
        logger.debug("Start: tree structure of domain : ", data.domainName);
        var treeData = [];
        var tree = {
            "name": data.domainName,
            "children": []
        };

        logger.debug("Data In getTreeOfDomain in Neo4j", data)
        // cypher('match (n:' + graphConsts.NODE_CONCEPT + ') return n.context AS context,n.name AS name,n.conceptid AS conceptid,n.desc as desc,n.parent AS parent')
        cypher('match (d:' + graphConsts.NODE_DOMAIN +
                '{name:"' + data.domainName + '"}) -[]- ' +
                '(c:' + graphConsts.NODE_CONCEPT + ') ' +
                // '{context:"' + data.domainName + '"})' +
                'return c.context AS context,c.name AS name,c.conceptid AS conceptid,c.desc AS desc,c.parent AS parent'
            )
            .on('data', function(result) {
                logger.debug("Result from Neo4j", result)
                treeData.push(result);
            })
            .on('end', function() {
                // console.log('all done');
                var dataMap = treeData.reduce(function(map, node) {
                    map[node.conceptid] = node;
                    return map;
                }, {});
                treeData.forEach(function(node) {
                    var parent = dataMap[node.parent];
                    node.size = 1;
                    if (parent) {
                        (parent.children || (parent.children = []))
                        .push(node);
                    } else {
                        tree.children.push(node);
                    }
                });
            })
            .on('end', function() {
                let p3 = JSON.stringify(tree);
                p3 = p3.replace("[", "[\n\t");
                p3 = p3.replace(/},/g, "},\n\t");
                p3 = p3.replace(/\\"/g, "");
                p3 = p3.replace(/,/g, ",\n\t");
                resolve(p3);
            });

    });
    return promise;
}

let deleteDomain = function(domain) {
    var neo4j = require('neo4j-driver').v1;
    var driver = neo4j.driver("bolt://localhost", neo4j.auth.basic("neo4j",
        "password"));
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
                console.log("COmpleted");
            },
            onError: function(err) {
                console.log(err);
            }
        });
}

let deleteDomainCallback = function(domain, callback) {
    deleteDomain(domain)
}

let indexNewDomainCallBack = function(newDomainObj, callback) {
    indexNewDomain(newDomainObj).then(function(indexedDomainObj) {
        callback(null, indexedDomainObj);
    }, function(err) {
        callback(err, null);
    });
}
let getTreeOfDomainCallback = function(domain, callback) {
    getTreeOfDomain(domain).then(function(indexedDomain) {
        callback(null, indexedDomain);
    }, function(err) {
        callback(err, null);
    });
}

let getDomainConceptCallback = function(domainName, callback) {
    getDomainConcept(domainName).then(function(retrievedDomainConcept) {
        callback(null, retrievedDomainConcept);
    }, function(err) {
        callback(err, null);
    });
}
let getDomainConceptWithDocCallback = function(domainName, callback) {
    getDomainConceptWithDoc(domainName).then(function(retrievedDomainConcept) {
        callback(null, retrievedDomainConcept);
    }, function(err) {
        callback(err, null);
    });
}
let getDomainIntentCallback = function(domainName, callback) {
    getDomainIntent(domainName).then(function(retrievedDomainConceptsAndIntents) {
        callback(null, retrievedDomainConceptsAndIntents);
    }, function(err) {
        callback(err, null);
    });
}
let getAllDomainConceptCallback = function(domainNameColln, callback) {
    getAllDomainConcept(domainNameColln).then(function(
        retrievedAllDomainConcept) {
        callback(null, retrievedAllDomainConcept);
    }, function(err) {
        callback(err, null);
    });
}

let getDomainCardDetailsCallback = function(domainName, callback) {
    logger.debug("from the callback : " + domainName)
    getDomainCardDetails(domainName).then(function(retrievedDomainConcept) {
        callback(null, retrievedDomainConcept);
    }, function(err) {
        callback(err, null);
    });
}

let getWebDocumentsCallback = function(domainObj, callback) {
    logger.debug("from the callback : " + domainObj)
    getWebDocuments(domainObj).then(function(retrievedDocs) {
        callback(null, retrievedDocs);
    }, function(err) {
        callback(err, null);
    });
}

module.exports = {
    indexNewDomain: indexNewDomain,
    getDomainConcept: getDomainConcept,
    getDomainConceptWithDoc: getDomainConceptWithDoc,
    getDomainIntent: getDomainIntent,
    getAllDomainConcept: getAllDomainConcept,
    indexNewDomainCallBack: indexNewDomainCallBack,
    getDomainConceptCallback: getDomainConceptCallback,
    getDomainConceptWithDocCallback: getDomainConceptWithDocCallback,
    getDomainIntentCallback: getDomainIntentCallback,
    getAllDomainConceptCallback: getAllDomainConceptCallback,
    getDomainCardDetailsCallback: getDomainCardDetailsCallback,
    getDomainCardDetails: getDomainCardDetails,
    getWebDocumentsCallback: getWebDocumentsCallback,
    getWebDocuments: getWebDocuments,
    getIntentforDocument: getIntentforDocument,
    getTreeOfDomain: getTreeOfDomain,
    getTreeOfDomainCallback: getTreeOfDomainCallback,
    deleteDomainCallback: deleteDomainCallback
}
