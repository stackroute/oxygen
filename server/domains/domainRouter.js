'use strict';
const logger = require('./../../applogger');
const router = require('express').Router();

const domainCtrl = require('./domainController');

// Mounted at mount point /domain/

// Create new domain
router.post('/:domainName', function(req, res) {

    try {

        let newDomainObj = req.body;
        logger.debug("in 8080 ",
            req.params.domainName);

        domainCtrl.publishNewDomain(newDomainObj)
            .then(function(savedDomainObj) {
                    logger.debug("Successfully published new domain: ",
                        savedDomainObj.name);
                    res.send(savedDomainObj);
                    return;
                },
                function(err) {
                    logger.error("Encountered error in publishing a new domain: ",
                        err);
                    res.status(500).send({
                        error: 'Failed to complete operation...!'
                    });
                    return;
                });
    } catch (err) {
        logger.error("Caught a error in posting new domain ", err);
        res.status(500).send({
            error: "Something went wrong, please try later..!"
        });
        return;
    }
});
router.post('/:domainName/crawl', function(req, res) {
    try {

        let reqObj = {
            domainName: req.params.domainName,
            data: req.body
        }
        logger.debug("sending data manually ", reqObj);

        res.send(domainCtrl.insertUrls(reqObj));
        return;


    } catch (err) {
        logger.error("Caught a error in posting URLs manually ", err);
        res.status(500).send({
            error: "Something went wrong, please try later..!"
        });
        return;
    }
});
// Get details of all domain in the system
router.get('/', function(req, res) {
    try {
        domainCtrl.getAllDomainDetails().then(function(cardDetailsObj) {
                logger.debug(
                    "Successfully retrieved all details to show length----->",
                    cardDetailsObj.length);
                res.send(cardDetailsObj);
                return;
            },
            function(err) {
                logger.error(
                    "Encountered error in retrieved concept(s) of domain: ",
                    err);
                res.send(err);
                return;
            })

    } catch (err) {
        logger.error("Caught a error in retrieved concept(s) of domain ", err);
        res.status(500).send({
            error: "Something went wrong, please try later..!"
        });
        return;
    }
});

// Get all domain in the system
router.get('/domains', function(req, res) {
    try {
        domainCtrl.getAllDomain().then(function(domainObj) {
                logger.debug(
                    "Successfully retrieved all details to show length----->",
                    domainObj.length);
                res.send(domainObj);
                return;
            },
            function(err) {
                logger.error("Encountered error in retrieving  domain: ",
                    err);
                res.send(err);
                return;
            })

    } catch (err) {
        logger.error("Caught a error in retrieving domains ", err);
        res.status(500).send({
            error: "Something went wrong, please try later..!"
        });
        return;
    }
});

// Get details of a specific domain by its name
router.get('/:domainName', function(req, res) {

    try {

        let domainName = req.params.domainName;
        domainCtrl.getDomain(domainName).then(function(domainDetails) {
                logger.info(
                    "Successfully retrieved all concepts and intents of a domain : "
                );
                logger.info(domainDetails)
                res.send(domainDetails);
                return;
            },
            function(err) {
                logger.error(
                    "Encountered error in retrieved concept(s) of domain: ",
                    err);
                res.send(err);
                return;
            })

    } catch (err) {
        logger.error("Caught a error in retrieved concept(s) of domain ", err);
        res.status(500).send({
            error: "Something went wrong, please try later..!"
        });
        return;
    }

});

// Freshly index a domain
router.post('/:domainName/index', function(req, res) {
    logger.debug("going to freshly index domain ", req.params.domainName);
    try {
        domainCtrl.freshlyIndexDomain(req.params.domainName).then(function(obj) {
                logger.debug("Successfully indexing for all concepts  ----->",
                    obj);
                res.send("Successfully done");
                return;
            },
            function(err) {
                logger.error(
                    "Encountered error in retrieved concept(s) of domain: ",
                    err);
                res.send(err);
                return;
            })

    } catch (err) {
        logger.error("Caught a error in retrieved concept(s) of domain ", err);
        res.status(500).send({
            error: "Something went wrong, please try later..!"
        });
        return;
    }
});

//get web Documents
router.post('/documents/:domainName', function(req, res) {
    logger.debug("got request for retrieving web documents ", req.body);
    logger.debug("Domain name ", req.body.domainName);
    //res.send('success');
    try {

        let domainObj = req.body;
        domainCtrl.fetchWebDocuments(domainObj).then(function(webDocuments) {
                logger.info("Successfully retrieved all we documents : ");
                logger.debug(webDocuments)
                res.send(webDocuments);
                return;
            },
            function(err) {
                logger.error(
                    "Encountered error in retrieved concept(s) of domain: ",
                    err);
                res.send(err);
                return;
            })

    } catch (err) {
        logger.error("Caught a error in retrieved concept(s) of domain ", err);
        res.status(500).send({
            error: "Something went wrong, please try later..!"
        });
        return;
    }

});

router.get('/domainhomeview/:domainName', function(req, res) {
    console.log('in DomainRouter');
    try {
        let reqObj = {
            domainName: req.params.domainName,
            data: req.body
        };

        var collection = domainCtrl.getTreeOfDomain(reqObj);
        // logger.debug('coll',collection);
        collection.then(function(jsonTree) {
            logger.debug("getting data into API")
                // logger.info(jsonTree);
            res.send(jsonTree);
            return;
        }, function(err) {
            logger.error(
                "Encountered error in retrieved concept(s) of domain: ",
                err);
            res.send(err);
            return;
        });

    } catch (err) {
        logger.error("Caught a error in posting URLs manually ", err);
        res.status(500).send({
            error: "Error: Failed get the tree structure"

        });
    }
});

router.post('/concept', function(req, res) {
    let domainObj = req.body;
    logger.debug("Got request to add a new concept to a domain", req.body);
    logger.debug("Domin name :" + domainObj.domain);

    try {
        domainCtrl.publishNewConcept(domainObj).then(function(conceptName) {
                logger.info("Successfully published a concept to the domain " + domainObj.domain);
                res.send(conceptName);
                return;
            },
            function(err) {
                logger.error(
                    "Encountered error in publishing concept : ",
                    err);
                res.send(err);
                return;
            })
    } catch (err) {
        logger.error("Caught a error in publishing a new concept to the domain ", err);
        res.status(500).send({
            error: "Something went wrong, please try later..!"
        });
        return;
    }
});

router.delete('/deletedomain/:domainName', function(req, res) {
    try {
        let reqObj = {
            domainName: req.params.domainName
        };
        console.log(reqObj);
        logger.debug("deletedomain:delete a domain", reqObj);
        res.send(domainCtrl.deleteDomain(reqObj));
        return;
    } catch (err) {
        logger.error("Caught a error in deleting a domain ", err);
        res.status(500).send({
            error: "Error: Failed to delete a domain"
        });
    }
});

router.get('/:intentName/terms', function(req, res) {
    try {
        let domainName = req.params.intentName;
        domainCtrl.getTermsIntents(domainName).then(function(domainDetails) {
                logger.info(
                    "Successfully retrieved all Relations and intents of a domain : "
                );
                logger.info(domainDetails)
                res.send(domainDetails);
                return;
            },
            function(err) {
                logger.error(
                    "Encountered error in retrieved concept(s) of domain: ",
                    err);
                res.send(err);
                return;
            })

    } catch (err) {
        logger.error("Caught a error in retrieved concept(s) of domain ", err);
        res.status(500).send({
            error: "Something went wrong, please try later..!"
        });
        return;
    }
})



router.post('/all/intents', function(req, res) {
    let domainObj = req.body;
    logger.debug("Got request to add a new intent to a domain", req.body);
    logger.debug("Domain name :" + domainObj.domain);

    try {
        domainCtrl.publishNewIntent(domainObj).then(function(intentName) {
                logger.info("Successfully published a intent to the domain " + domainObj.domain);
                res.send(intentName);
                return;
            },
            function(err) {
                logger.error(
                    "Encountered error in publishing intent : ",
                    err);
                res.send(err);
                return;
            })
    } catch (err) {
        logger.error("Caught a error in publishing a new intent to the domain ", err);
        res.status(500).send({
            error: "Something went wrong, please try later..!"
        });
        return;
    }
});

//Adding new term to a existing intent
router.post('/all/term', function(req, res) {
    let intentObj = req.body;
    logger.debug("Got request to add a new term to a intent", req.body);
    logger.debug("Intent name :" + intentObj.intent);

    try {
        domainCtrl.publishNewTerm(intentObj).then(function(termName) {
                logger.info("Successfully published a term to the intent " + intentObj.intent);
                res.send(termName);
                return;
            },
            function(err) {
                logger.error(
                    "Encountered error in publishing term : ",
                    err);
                res.send(err);
                return;
            })
    } catch (err) {
        logger.error("Caught a error in publishing a new term to the intent ", err);
        res.status(500).send({
            error: "Something went wrong, please try later..!"
        });
        return;
    }
});



router.post('/delete/relation', function(req, res) {

    let deleteObj = req.body;

    logger.info("Got request to delete a relationship :" + deleteObj.subject);



    try {

        subjectObjectCtrl.deleteRelation(deleteObj).then(function(result) {

                logger.info("Successfully deleted the relationship...!!!");

                return;

            },

            function(err) {

                logger.error("Encountered error in deleting : ", err);

                res.send(err);

                return;

            });

    } catch (err) {

        logger.error("Caught an error in deleting ", err);

        res.status(500).send({

            error: "Something went wrong, please try later..!"

        });
        return;
    }
});

//Adding sub concept to a concept

router.post('/:domainName/subject/:subject/object/:object', function(req, res) {
    let addSubconcept = {
        domain: req.params.domainName,
        subjectNode: req.params.subject,
        objectNode: req.params.object
    }
    logger.debug("Got request to add a sub concept to a concept");
    logger.debug("Concept name :" + addSubconcept.subjectNode);

    try {
        subjectObjectCtrl.publishNewSubConcept(addSubconcept).then(function(objectName) {
                logger.info("Successfully published a subConcept to the concept " + addSubconcept.subjectNode);
                res.send(objectName);
                return;
            },
            function(err) {
                logger.error(
                    "Encountered error in publishing subConcept : ",
                    err);
                res.send(err);
                return;
            })
    } catch (err) {
        logger.error("Caught a error in publishing a subConcept to the concept ", err);
        res.status(500).send({
            error: "Something went wrong, please try later..!"
        });
        return;
    }
});

//Generalized adding for Concept,Intent and Term

router.post('/:domainName/subject/:subject/object/:object/predicate/:relation', function(req, res) {

    let addItem = {
        domain: req.params.domainName,
        subjectNode: req.params.subject,
        objectNode: req.params.object,
        relationName: req.params.relation
    }

    logger.debug("object", addItem.objectNode);
    logger.debug("relation", addItem.relationName);

    logger.debug("Got request to add a subject");
    logger.debug("Subject name :" + addItem.subjectNode);

    try {
        subjectObjectCtrl.publishNewAddItem(addItem).then(function(objectName) {
                logger.info("Successfully published a Subject " + addItem.subjectNode);
                res.send(objectName);
                return;
            },
            function(err) {
                logger.error(
                    "Encountered error in publishing subjectNode : ",
                    err);
                res.send(err);
                return;
            })
    } catch (err) {
        logger.error("Caught a error in publishing a subjectNode ", err);
        res.status(500).send({
            error: "Something went wrong, please try later..!"
        });
        return;
    }
});

router.get('/:domainName/:subjectType/:subjectName/objects', function(req, res) {
    logger.debug("Got request to get Objects of", req.params.subjectType);
    logger.debug("Node name :" + req.params.subjectName);
    let nodeObj = {
        nodeType: req.params.subjectType,
        nodeName: req.params.subjectName,
        domainName: req.params.domainName
    }

    try {
        subjectObjectCtrl.getObjects(nodeObj).then(function(objects) {
                logger.info("Successfully published a term to the intent " + objects);
                res.send(objects);
                return;
            },
            function(err) {
                logger.error(
                    "Encountered error in publishing term : ",
                    err);
                res.send(err);
                return;
            })
    } catch (err) {
        logger.error("Caught error getting objects ", err);
        res.status(500).send({
            error: "Something went wrong, please try later..!"
        });
        return;
    }
});

//Editing Term relation with Intent

router.patch('/:domainName/intent/:intentName/term/:termName/predicate/:relation', function(req, res) {

    let editTermRelation = {
        domain: req.params.domainName,
        intentName: req.params.intentName,
        termName: req.params.termName,
        relationName: req.params.relation
    }
    logger.debug("Got request to edit a Intent terrm relation");
    logger.debug("Intent name :" + editTermRelation.intentName);

    try {
        subjectObjectCtrl.publishEditedIntentTermRelation(editTermRelation).then(function(objectName) {
                logger.info("Successfully Edited a Intent terrm relation for " + editTermRelation.intentName);
                res.send(objectName);
                return;
            },
            function(err) {
                logger.error(
                    "Encountered error in publishing Intent terrm relation : ",
                    err);
                res.send(err);
                return;
            })
    } catch (err) {
        logger.error("Caught a error in publishing a Intent terrm relation ", err);
        res.status(500).send({
            error: "Something went wrong, please try later..!"
        });
        return;
    }
});



router.patch('/:domainName/intent/:intentName/term/:termName/predicate/:relation/weightValue/:weight', function(req, res) {

    let editTermRelationWeight = {
        domain: req.params.domainName,
        intentName: req.params.intentName,
        termName: req.params.termName,
        relationName: req.params.relation,
        weightValue: req.params.weightValue
    }
    logger.debug("Got request to edit a Intent term weight");
    logger.debug("Intent name :" + editTermRelationWeight.intentName);

    try {
        subjectObjectCtrl.publishEditedIntentTermRelationWeight(editTermRelationWeight).then(function(objectName) {
                logger.info("Successfully Edited a Intent terrm weight for " + editTermRelationWeight.intentName);
                res.send(objectName);
                return;
            },
            function(err) {
                logger.error(
                    "Encountered error in publishing Intent term weight : ",
                    err);
                res.send(err);
                return;
            })
    } catch (err) {
        logger.error("Caught a error in publishing a Intent term weight ", err);
        res.status(500).send({
            error: "Something went wrong, please try later..!"
        });
        return;
    }
});

module.exports = router;
