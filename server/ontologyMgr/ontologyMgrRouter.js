'use strict';
const logger = require('./../../applogger');
const router = require('express').Router();
const ontologyMgrCtrl = require('./ontologyMgrController');

router.put('/:domainname/subject/:nodetype/:nodename', function(req, res) {
    let subject = {
        domainName: req.params.domainname,
        nodeType: req.params.nodetype,
        nodeName: req.params.nodename
    };
    let object = req.body;

    logger.debug("Generalize add Receiving nodetype: " + subject.nodeName);
    try {

        ontologyMgrCtrl.publishAddNode(subject, object).then(function(nodename) {
            logger.info("Successfully published a Generalized Add: " + subject.domainName);
            res.send(nodename);
            return;
        }, function(err) {
            logger.error("Encountered error in publishing Generalized Add: ", err);
            res.send(err);
            return;
        })
    } catch (err) {
        logger.error("Caught a error in publishing a Generalized Add: ", err);
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
                    logger.debug("Successfully deleted the Object: ", deleteObj.objNodeName);
                    res.send(result);
                    return;
                },
                function(err) {
                    logger.error("Encountered error in deleting the object: ",
                        err);
                    res.status(500).send({
                        error: 'Failed to complete operation...!'
                    });
                    return;
                });
    } catch (error) {
        logger.error("Caught a error in posting new domain ", error);
        res.status(500).send({
            error: "Something went wrong, please try later..!"
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
        }
        logger.debug("Got request to delete the Orphan nodes");
        ontologyMgrCtrl.deleteOrphans(deleteObj).then(function(result) {
                logger.info("Successfully deleted the node" + deleteObj.nodename);
                res.send(result);
                return;
            },
            function(err) {
                logger.error(
                    "Encountered error in deleting the node: ",
                    err);

                res.status(500).send({
                    error: "Something went wrong, please try later..!"
                });
                return;
            });
    } catch (err) {
        logger.error("Caught a error in deleting the node ", err);
    }
});


router.get("/:domainname/subject/:nodetype/:nodename/object/:nodetype1/:nodename1/predicates/:predicatename", function(req, res) {
    //logger.debug("am I getting displayed?", req.params.predicatename)
    let subject = {
        domainname: req.params.domainname,
        nodetype: req.params.nodetype,
        nodename: req.params.nodename,
        nodetype1: req.params.nodetype1,
        nodename1: req.params.nodename1,
        predicates: req.params.predicatename
    }


    try {
        ontologyMgrCtrl.publishRelations(subject).then(function(nodename) {
            logger.info("Got requests from :" + req.params.domainname);
            res.send(nodename);
            return;
        }, function(err) {
            logger.error("Encountered error in publishing the predicates: ", err);
            res.send(err);

            return;
        });
    } catch (err) {
        logger.error("Caught a error in publishing a predicate: ", err);

        res.status(500).send({
            error: "Something went wrong, please try later..!"
        });
        return;
    }
});

router.get("/:domainname/subject/:nodetype/:nodename/object/:nodetype1/:nodename1/predicates", function(req, res) {
    //logger.debug("am I getting displayed?", req.params.predicatename)
    let subject = {
        domainname: req.params.domainname,
        nodetype: req.params.nodetype,
        nodename: req.params.nodename,
        nodetype1: req.params.nodetype1,
        nodename1: req.params.nodename1
    }

    try {
        ontologyMgrCtrl.publishAllRelations(subject).then(function(nodename) {
            logger.info("Got requests from :" + req.params.domainname);
            res.send(nodename);
            return;
        }, function(err) {
            logger.error("Encountered error in publishing the predicates: ", err);
            res.send(err);

            return;
        });
    } catch (err) {
        logger.error("Caught a error in publishing a predicate: ", err);
        res.status(500).send({
            error: "Something went wrong, please try later..!"
        });
        return;
    }
});


//Editing Term relation with Intent
//Yogee codes

router.put('/:domainname/subject/:nodetype1/:nodename1/object/:nodetype2/:nodename2/predicate/:predicatename', function(req, res) {
    let props=req.body;
    let editTermRelation = {
        domain: req.params.domainName,
        subjectName: req.params.nodename1,
        objectName: req.params.nodename2,
        subjectType: req.params.nodetype1,
        objectType: req.params.nodetype2,
        relationName: req.params.predicatename,
        attributes: props
    }
    logger.debug("Got request to edit a Subject object relation");
    logger.debug("Attributes name :" + editTermRelation.attributes);
    logger.debug("Intent name :" + editTermRelation.subjectName);


    try {
        ontologyMgrCtrl.publishEditedSubjectObjectAttributes(editTermRelation).then(function(objectName) {
                logger.info("Successfully Edited a Intent term relation for " + editTermRelation.subjectName);
                res.send(objectName);
                return;
            },
            function(err) {
                logger.error(
                    "Encountered error in publishing Subject object relation : ",
                    err);
                res.send(err);
                return;
            })
    } catch (err) {
        logger.error("Caught a error in publishing a Subject object relation ", err);
        res.status(500).send({
            error: "Something went wrong, please try later..!"
        });
        return;
    }
});


//Finding number of orphaned nodes in the given nodes

router.get("/:domainname/subject/:nodetype/:nodename", function(req, res) {
    //logger.debug("am I getting displayed?", req.params.predicatename)
    let subject = {
        domainname: req.params.domainname,
        nodetype: req.params.nodetype,
        nodename: req.params.nodename
    }

    try {
        ontologyMgrCtrl.publishAllOrphanedNodes(subject).then(function(nodename) {
            logger.info("Got requests from :" + req.params.domainname);
            res.send(nodename);
            return;
        }, function(err) {
            logger.error("Encountered error in publishing the predicates: ", err);
            res.send(err);

            return;
        });
    } catch (err) {
        logger.error("Caught a error in publishing orphans: ", err);
        res.status(500).send({
            error: "Something went wrong, please try later..!"
        });
        return;
    }
});
module.exports = router;
