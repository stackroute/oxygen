'use strict';
const logger = require('./../../applogger');
const router = require('express').Router();

const domainCtrl = require('./domainController');
const domainMgr = require('./domainManager');

const DOMAIN_NAME_MIN_LENGTH = 3;

// Mounted at mount point /domain/

// Create new domain
router.post('/:domainName', function(req, res) {

  try {

    let newDomainObj = req.body;

    domainCtrl.publishNewDomain(newDomainObj)
      .then(function(savedDomainObj) {
          // Manually push this execution to background
          process.nextTick(function() {
            logger.debug("initialising New Domain ", savedDomainObj);
            domainMgr.initialiseNewDomain(savedDomainObj.name);
          });

          logger.debug("Successfully created new domain: ", savedDomainObj);
          res.send(savedDomainObj);
          return;
        },
        function(err) {
          logger.error("Encountered error in publishing a new domain: ",
            err);
          res.send(err);
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

// Get details of all domain in the system
router.get('/', function(req, res) {
  res.send({});
});

// Get details of a specific domain by its name
router.get('/:domainName', function(req, res) {
  res.send({});
});

// Freshly index a domain
router.post('/:domainName/index', function(req, res) {
  res.send({});
});

module.exports = router;
