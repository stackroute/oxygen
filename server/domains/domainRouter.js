'use strict';
const logger = require('./../../applogger');
const router = require('express').Router();

const domainCtrl = require('./domainController');

const DOMAIN_NAME_MIN_LENGTH = 3;

// Mounted at mount point /domain/

// Create new domain
router.post('/:domainName', function(req, res) {

  try {

    let newDomainObj = req.body;
    logger.debug("in 8080 ",
      req.params.domainName);

    domainCtrl.publishNewDomain(newDomainObj)
    .then(function(savedDomainObj) {
      logger.debug("!!!!!!!!!!!!@@@@@@@@@@ $$$$$$$$$Successfully published new domain: ",
        savedDomainObj.name);
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

 try {

  let domainName = req.params.domainName;

  domainCtrl.getDomain(domainName).then(function(domainConcept) {
    logger.debug("Successfully retrived concept(s) of domain: "+domainName,
      domainConcept);
    res.send(domainConcept);
    return;
  },
  function(err) {
    logger.error("Encountered error in retrived concept(s) of domain: ",
      err);
    res.send(err);
    return;
  })

} catch (err) {
  logger.error("Caught a error in retrived concept(s) of domain ", err);
  res.status(500).send({
    error: "Something went wrong, please try later..!"
  });
  return;
}

});

// Freshly index a domain
router.post('/:domainName/index', function(req, res) {
  res.send({});
});

module.exports = router;
