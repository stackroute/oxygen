'use strict';
const logger = require('./../../applogger');
const router = require('express').Router();
const ontologyMgrCtrl = require('./ontologyMgrController');


router.get('/:domainName/subjects', function (req, res) {
    let domain = {
      name: req.params.domainName
    }
    try {
        ontologyMgrCtrl.getAllDomainDetails(domain).then(function (Obj) {
                logger.debug(
                    "Successfully retrieved all details to show length----->",
                    Obj.length);
                res.send(Obj);
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

router.get('/:domainname/subject/:nodetype/:nodename/objects', function(req,res){
  let reqObj = {
    domainname: req.params.domainname,
    nodetype: req.params.nodetype,
    nodename: req.params.nodename
  }
  try {
      ontologyMgrCtrl.getSubjectObjects(reqObj).then(function (Obj) {
              logger.debug(
                  "Successfully retrieved all details to show length----->",
                  Obj.length);
              res.send(Obj);
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
})
module.exports = router;
