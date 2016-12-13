'use strict';

const logger = require('./../../applogger');
const Router = require('express').Router();
const controller = require('./domainController');

//  Effective API URI will be /docsearchjob/job
Router.post('/addDomain', function(req, res) {
  try {
    let ack=controller.addJob(req.body, (err, result) => {
      if (err) {
        logger.error('Error in fetching entity ', err);
        return res.status(500).json({
          error: 'Something went wrong, please try later..!'
        });
      }

      //  SUCCESS
      console.log("from the addjob server side :")
      console.log(result)
      return res.json(result);
    });
    return ack;
  } catch (err) {
    logger.error("Caught exception: ", err);

    return res.status(500).json({
      error: 'Something went wrong in catch, please try later..!'
    });
  }

});
Router.get('/showDomain', function(req, res) {
 try {
  let sendData=controller.showJob((err,result) => {
    if (err) {
      logger.error('Error in fetching entity ', err);
      return res.status(500).json({
        error: 'Something went wrong, please try later..!'
      });
    }

      //  SUCCESS


      console.log("from the showjob server side :")
      console.log(result)
      return res.json(result);

    });
  return sendData;

} catch (err) {
  logger.error("Caught exception: ", err);

  return res.status(500).json({
    error: 'Something went wrong in catch, please try later..!'
  });
}
});


Router.post('/addJob', function(req, res) {
  try {
    let ack=controller.addJob(req.body, (err, result) => {
      if (err) {
        logger.error('Error in fetching entity ', err);
        return res.status(500).json({
          error: 'Something went wrong, please try later..!'
        });
      }

      //  SUCCESS
      console.log("from the addjob server side :")
      console.log(result)
      return res.json(result);
    });
    return ack;
  } catch (err) {
    logger.error("Caught exception: ", err);

    return res.status(500).json({
      error: 'Something went wrong in catch, please try later..!'
    });
  }

});

module.exports = Router;
