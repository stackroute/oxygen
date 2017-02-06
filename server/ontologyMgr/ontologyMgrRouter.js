'use strict';
const logger = require('./../../applogger');
const router = require('express').Router();
const ontologyMgrCtrl = require('./ontologyMgrController');

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
        res.status(500).send({
            error: "Something went wrong, please try later..!"
        });
        return;
    }
});
module.exports = router;
