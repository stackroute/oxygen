'use strict';
const logger = require('./../../applogger');
const router = require('express').Router();
const ontologyMgrCtrl = require('./ontologyMgrController');

router.get('/:domainName/subjects', function(req, res) {
    let domain = {
        name: req.params.domainName
    };
    try {
        ontologyMgrCtrl.getAllDomainDetails(domain).then(function(Obj) {
                logger.debug(
                    'Successfully retrieved all details to show length----->',
                    Obj.length);
                res.send(Obj);
                return;
            },
            function(err) {
                logger.error(
                    'Encountered error in retrieved concept(s) of domain: ',
                    err);
                res.send(err);
                return;
            });
    } catch (err) {
        logger.error('Caught a error in retrieved concept(s) of domain ', err);
    }
});

router.put('/:domainname/subject/:nodetype/:nodename', function(req, res) {
    let subject = {
        domainName: req.params.domainname,
        nodeType: req.params.nodetype,
        nodeName: req.params.nodename
    };
    let object = req.body;

    logger.debug('Generalize add Receiving nodetype: ' + subject.nodeName);
    try {
      ontologyMgrCtrl.publishAddNode(subject, object).then(function(nodename) {
            logger.info('Successfully published a Generalized Add: ' + subject.domainName);
            res.send(nodename);
            return;
        }, function(err) {
            logger.error('Encountered error in publishing Generalized Add: ', err);
            res.send(err);
            return;
        });
    } catch (err) {
        logger.error('Caught a error in publishing a Generalized Add: ', err);
    }
});

router.delete('/:domainName/subject/:nodeType1/:nodeName1/object/:nodeType2/:nodeName2/predicate/:predicateName', (req, res) => {
    try {
        let deleteObj = {
            domainName: req.params.domainName,
            subNodeType: req.params.nodeType1,
            subNodeName: req.params.nodeName1,
            objNodeType: req.params.nodeType2,
            objNodeName: req.params.nodeName2,
            predicateName: req.params.predicateName
        };

        ontologyMgrCtrl.deleteObject(deleteObj)
            .then(function(result) {
                    logger.debug('Successfully deleted the Object: ', deleteObj.objNodeName);
                    res.send(result);
                    return;
                },
                function(err) {
                    logger.error('Encountered error in deleting the object: ',
                        err);
                    res.status(500).send({
                        error: 'Failed to complete operation...!'
                    });
                    return;
                });
    } catch (error) {
        logger.error('Caught a error in posting new domain ', error);
        res.status(500).send({
            error: 'Something went wrong, please try later..!'
        });
        return;
    }
});

router.delete('/:domainName/subject/:nodeType/:nodeName', (req, res) => {
  try {
     let deleteObj = {
         domainName: req.params.domainName,
         nodeType: req.params.nodeType,
         nodeName: req.params.nodeName,
         cascade: req.query.cascade
     };
     logger.debug('Got request to delete the Orphan nodes');
     ontologyMgrCtrl.deleteOrphans(deleteObj).then(function(result) {
             logger.info('Successfully deleted the node' + deleteObj.nodeName);
             res.send(result);
             return;
         },
         function(err) {
             logger.error(
                 'Encountered error in deleting the node: ',
                 err);

             res.status(500).send({
                 error: 'Something went wrong, please try later..!'
             });
             return;
         });
 } catch (err) {
     logger.error('Caught a error in deleting the node ', err);
   }
 });
 router.get('/:domainname/subject/:nodetype/:nodename/object/:nodetype1/:nodename1/predicates/:predicatename', function(req, res) {
   // logger.debug('am I getting displayed?', req.params.predicatename)
    let subject = {
        domainname: req.params.domainname,
        nodetype: req.params.nodetype,
        nodename: req.params.nodename,
        nodetype1: req.params.nodetype1,
        nodename1: req.params.nodename1,
        predicates: req.params.predicatename
    };


    try {
        ontologyMgrCtrl.publishRelations(subject).then(function(nodename) {
            logger.info('Got requests from :' + req.params.domainname);
            res.send(nodename);
            return;
        }, function(err) {
            logger.error('Encountered error in publishing the predicates: ', err);
            res.send(err);

            return;
        });
    } catch (err) {
        logger.error('Caught a error in publishing a predicate: ', err);

        res.status(500).send({
            error: 'Something went wrong, please try later..!'
        });
        return;
    }
});

router.get('/:domainname/subject/:nodetype/:nodename/object/:nodetype1/:nodename1/predicates', function(req, res) {
    // logger.debug('am I getting displayed?', req.params.predicatename)
    let subject = {
        domainname: req.params.domainname,
        nodetype: req.params.nodetype,
        nodename: req.params.nodename,
        nodetype1: req.params.nodetype1,
        nodename1: req.params.nodename1
    };

    try {
        ontologyMgrCtrl.publishAllRelations(subject).then(function(nodename) {
            logger.info('Got requests from :' + req.params.domainname);
            res.send(nodename);
            return;
        }, function(err) {
            logger.error('Encountered error in publishing the predicates: ', err);
            res.send(err);

            return;
        });
    } catch (err) {
        logger.error('Caught a error in publishing a predicate: ', err);

        res.status(500).send({
            error: 'Something went wrong, please try later..!'
        });
        return;
    }
});

router.get('/:domainname/subject/:nodetype/:nodename/object/:nodetype1/:nodename1', function(req, res) {
    // logger.debug('am I getting displayed?', req.params.predicatename)
    let subject = {
        domainname: req.params.domainname,
        nodetype: req.params.nodetype,
        nodename: req.params.nodename,
        nodetype1: req.params.nodetype1,
        nodename1: req.params.nodename1
    };

    try {
        ontologyMgrCtrl.publishAllAttributes(subject).then(function(nodename) {
            logger.info('Got requests from :' + req.params.domainname);
            res.send(nodename);
            return;
        }, function(err) {
            logger.error('Encountered error in publishing the attributes: ', err);
            res.send(err);
            return;
        });
    } catch (err) {
        logger.error('Caught a error in publishing a attributes: ', err);
        res.status(500).send({
            error: 'Something went wrong, please try later..!'
        });
        return;
    }
});

router.put('/:domainname/subject/:nodetype1/:nodename1/object/:nodetype2/:nodename2/predicate/:predicatename', function(req, res) {
    let props = req.body;
    let editTermRelation = {
        domain: req.params.domainName,
        subjectName: req.params.nodename1,
        objectName: req.params.nodename2,
        subjectType: req.params.nodetype1,
        objectType: req.params.nodetype2,
        relationName: req.params.predicatename,
        attributes: props
    };
    logger.debug('Got request to edit a Subject object relation');
    logger.debug('Attributes name :' + editTermRelation.attributes);
    logger.debug('Intent name :' + editTermRelation.subjectName);


    try {
        ontologyMgrCtrl.publishEditedSubjectObjectAttributes(editTermRelation).then(function(objectName) {
                logger.info('Successfully Edited a Intent term relation for ' + editTermRelation.subjectName);
                res.send(objectName);
                return;
            },
            function(err) {
                logger.error(
                    'Encountered error in publishing Subject object relation : ',
                    err);
                res.send(err);
                return;
            });
    } catch (err) {
        logger.error('Caught a error in publishing a Subject object relation ', err);
        res.status(500).send({
            error: 'Something went wrong, please try later..!'
        });
        return;
    }
});

router.get('/:domainname/subject/:nodetype/:nodename/objects', function(req, res) {
    let reqObj = {
        domainname: req.params.domainname,
        nodetype: req.params.nodetype,
        nodename: req.params.nodename
    };
    try {
        ontologyMgrCtrl.getSubjectObjects(reqObj).then(function(Obj) {
                logger.debug(
                    'Successfully retrieved all details to show length----->',
                    Obj.length);
                res.send(Obj);
                return;
            },
            function(err) {
                logger.error(
                    'Encountered error in retrieved concept(s) of domain: ',
                    err);
                res.send(err);
                return;
            });
    } catch (err) {
        logger.error('Caught a error in retrieved concept(s) of domain ', err);
        res.status(500).send({
            error: 'Something went wrong, please try later..!'
        });
        return;
    }
});

router.patch('/:domainName/subject/:nodetype/:nodename', function(req, res) {
    try {
        let props = req.body;
        let subject = {
            domain: req.params.domainName,
            nodetype: req.params.nodetype,
            nodename: req.params.nodename,
            properties: props
        };
        ontologyMgrCtrl.modifySubjectProperties(subject)
            .then(function(modifiedProperties) {
                    logger.debug('Successfully added/modified props', modifiedProperties);
                    res.send(modifiedProperties);
                    return;
                },
                function(err) {
                    logger.error('Posting properties error',
                        err);
                    res.status(200).send({
                        error: 'Failed to complete operation...!'
                    });
                    return;
                });
    } catch (err) {
        logger.error('Caught a error in editing properties', err);
        res.status(500).send({
            error: 'Something went wrong, please try later..!'
        });
        return;
    }
});

router.get('/:domainName/subject/:nodetype/:nodename', function(req, res) {
    try {
        let props = req.body;
        let subject = {
            domain: req.params.domainName,
            nodetype: req.params.nodetype,
            nodename: req.params.nodename,
            properties: props
        };
        ontologyMgrCtrl.getAllOrphans(subject)
            .then(function(modifiedProperties) {
                    logger.debug('Successfully added/modified props', modifiedProperties);
                    res.send(modifiedProperties);
                    return;
                },
                function(err) {
                    logger.error('Posting properties error',
                        err);
                    res.status(200).send({
                        error: 'Failed to complete operation...!'
                    });
                    return;
                });
    } catch (err) {
        logger.error('Caught a error in editing properties', err);
        res.status(500).send({
            error: 'Something went wrong, please try later..!'
        });
        return;
    }
});

router.get('/:domainname/search', function(req, res) {
    let reqObj = {
        domainname: req.params.domainname,
    };
    try {
        ontologyMgrCtrl.getSearch(reqObj).then(function(Obj) {
                logger.debug(
                    'Successfully retrieved all details to show length----->',
                    Obj.length);
                res.send(Obj);
                return;
            },
            function(err) {
                logger.error(
                    'Encountered error in retrieved concept(s) of domain: ',
                    err);
                res.send(err);
                return;
            });
    } catch (err) {
        logger.error('Caught a error in retrieved concept(s) of domain ', err);
        res.status(500).send({
            error: 'Something went wrong, please try later..!'
        });
        return;
    }
});

router.post('/:domainname/resource', function(req, res) {
    let reqObj = {
        domainname: req.params.domainname,
        resourceDetails: req.body
    };
    try {
        ontologyMgrCtrl.createResource(reqObj).then(function(Obj) {
                logger.debug(
                    'Successfully Posted all details to show length----->',
                    reqObj.length);
                res.send(Obj);
                return;
            },
            function(err) {
                logger.error(
                    'Encountered Error Creating Resource of domain: ',
                    err);
                res.send(err);
                return;
            });
    } catch (err) {
        logger.error('Caught a error in creating resource for a domain ', err);
        res.status(200).send({
            err: 'Something went wrong, please try later..!'
        });
        return;
    }
});

router.post('/:domainname/subject/:nodetype/:nodename/object', function(req, res) {
    let reqObj = {
        domainname: req.params.domainname,
        subname: req.params.nodename,
        subtype: req.params.nodetype,
        resourceDetails: req.body
    };
    try {
        ontologyMgrCtrl.formStatement(reqObj).then(function(Obj) {
                logger.debug(
                    'Successfully Posted all details to show length----->',
                    reqObj.length);
                res.send(Obj);
                return;
            },
            function(err) {
                logger.error(
                    'Encountered Error Creating Resource of domain: ',
                    err);
                res.send(err);
                return;
            });
    } catch (err) {
        logger.error('Caught a error in creating resource for a domain ', err);
        res.status(200).send({
            err: 'Something went wrong, please try later..!'
        });
        return;
    }
});

router.get('/domainview/:domainName/intents', function(req, res) {
    logger.debug('in Ontology Router');
    try {
        let reqObj = {
            domainName: req.params.domainName
        };

        var collection = ontologyMgrCtrl.getIntentOfDomain(reqObj);
        // logger.debug('coll',collection);
        collection.then(function(jsonTree) {
            logger.debug('getting data into API');
                // logger.info(jsonTree);
            res.send(jsonTree);
            return;
        }, function(err) {
            logger.error(
                'Encountered error in retrieved details of domain: ',
                err);
            res.send(err);
            return;
        });
    } catch (err) {
        logger.error('Caught a error in posting URLs manually ', err);
        res.status(500).send({
            error: 'Error: Failed get the tree structure'
        });
    }
});

module.exports = router;
