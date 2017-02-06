'use strict';
const logger = require('./../../applogger');
const router = require('express').Router();
const ontologyMgrCtrl = require('./ontologyMgrController');

<<<<<<< HEAD
//Code for : Generalized add API for Concept,Intent and Term with Predicate
//Developer : Kowsikan

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
=======
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
>>>>>>> ad11f9654ae427fd14f1bcac971a7fc745a42a7a

        res.status(500).send({
            error: "Something went wrong, please try later..!"
        });
        return;
    }
});

module.exports = router;
<<<<<<< HEAD
=======

>>>>>>> ad11f9654ae427fd14f1bcac971a7fc745a42a7a
