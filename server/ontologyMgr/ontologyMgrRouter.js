'use strict';
const logger = require('./../../applogger');
const router = require('express').Router();
const ontologyMgrCtrl = require('./ontologyMgrController');

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

        res.status(500).send({
            error: "Something went wrong, please try later..!"
        });
        return;
    }
});

module.exports = router;
