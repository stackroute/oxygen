'use strict';
const logger = require('./../../applogger');
const router = require('express').Router();

const domainCtrl = require('./domainController');

// Mounted at mount point /domain/

// Create new domain
router.post('/:domainName', function (req, res) {

    try {

        let newDomainObj = req.body;
        logger.debug("in 8080 ",
            req.params.domainName);

        domainCtrl.publishNewDomain(newDomainObj)
            .then(function (savedDomainObj) {
                    logger.debug("Successfully published new domain: ",
                        savedDomainObj.name);
                    res.send(savedDomainObj);
                    return;
                },
                function (err) {
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
router.post('/:domainName/crawl', function (req, res) {
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
router.get('/', function (req, res) {
    try {
        domainCtrl.getAllDomainDetails().then(function (cardDetailsObj) {
                logger.debug(
                    "Successfully retrieved all details to show length----->",
                    cardDetailsObj.length);
                res.send(cardDetailsObj);
                return;
            },
            function (err) {
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
router.get('/domains', function (req, res) {
    try {
        domainCtrl.getAllDomain().then(function (domainObj) {
                logger.debug(
                    "Successfully retrieved all details to show length----->",
                    domainObj.length);
                res.send(domainObj);
                return;
            },
            function (err) {
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
router.get('/:domainName', function (req, res) {

    try {

        let domainName = req.params.domainName;
        domainCtrl.getDomain(domainName).then(function (domainDetails) {
                logger.info(
                    "Successfully retrieved all concepts and intents of a domain : "
                );
                logger.info(domainDetails)
                res.send(domainDetails);
                return;
            },
            function (err) {
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
router.post('/:domainName/index', function (req, res) {
    logger.debug("going to freshly index domain ", req.params.domainName);
    try {
        domainCtrl.freshlyIndexDomain(req.params.domainName).then(function (obj) {
                logger.debug("Successfully indexing for all concepts  ----->",
                    obj);
                res.send("Successfully done");
                return;
            },
            function (err) {
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
router.post('/documents/:domainName', function (req, res) {
    logger.debug("got request for retrieving web documents ", req.body);
    logger.debug("Domain name ", req.body.domainName);
    //res.send('success');
    try {

        let domainObj = req.body;
        domainCtrl.fetchWebDocuments(domainObj).then(function (webDocuments) {
                logger.info("Successfully retrieved all we documents : ");
                logger.debug(webDocuments)
                res.send(webDocuments);
                return;
            },
            function (err) {
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

// router.get('/domainhomeview/:domainName', function (req, res) {
//     console.log('in DomainRouter')
//     try {
//         let reqObj = {
//             domainName: req.params.domainName,
//             data: req.body
//     };

//         logger.debug("DomainHomeView: Begining to get tree structure ", reqObj);
//         console.log('reqObj', reqObj);
//         res.send(domainCtrl.getTreeOfDomain(reqObj));
//         return;
//     } catch (err) {
//         logger.error("Caught a error in posting URLs manually ", err);
//         res.status(500).send({
//             error: "Error: Failed get the tree structure"

//         });
//     }
// });
router.get('/domainhomeview/:domainName', function (req, res) {
    
    console.log('in DomainRouter')
    try {
        let reqObj = {
            domainName: req.params.domainName,
            data: req.body
    };

           var collection = domainCtrl.getTreeOfDomain(reqObj);
           // logger.debug('coll',collection);
           collection.then(function(jsonTree){
                logger.debug("getting data into API")
             // logger.info(jsonTree);
             res.send(jsonTree);
             return; 
            },function (err) {
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

router.delete('/deletedomain/:domainName', function (req, res) {
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

router.get('/test/:testparam', function (req, res) {
    try {

        let reqObj = {
            param1: req.param.testparam,
            data: req.body
        }
        logger.debug("sending data manually to test fn generator ", reqObj);
        res.send(domainCtrl.testFnGen(reqObj));
        return;

    } catch (err) {
        logger.error("Caught a error in posting URLs manually ", err);
        res.status(500).send({
            error: "Something went wrong, please try later..!"
        });
        return;
    }
});


module.exports = router;
