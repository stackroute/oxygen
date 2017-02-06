'use strict';
const logger = require('./../../applogger');
const router = require('express').Router();
const ontologyMgrCtrl = require('./ontologyMgrController');

//This api is to delete an object given the subject and predicate.
//This sends the given data to the controller, which further does the required operation.
router.delete('/:domainName/subject/:nodeType1/:nodeName1/object/:nodeType2/:nodeName2/predicate/:predicateName',(req, res) => {
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

module.exports = router;
