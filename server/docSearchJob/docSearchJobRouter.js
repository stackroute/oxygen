'use strict';

const logger = require('./../../applogger');
const Router = require('express').Router();
const controller = require('./docSearchJobController');

//  Effective API URI will be /docsearchjob/job
Router.post('/job', function(req, res) {
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
Router.get('/show', function(req, res) {
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

Router.delete('/delete', function(req, res) {
 try {
  let del=controller.deleteJob(req.body,(err,result) => {
    if (err) {
      logger.error('Error in fetching entity ', err);
      return res.status(500).json({
        error: 'Something went wrong, please try later..!'
      });
    }

      //  SUCCESS
      console.log("from the deletejob server side :")
      console.log(result)
      return res.json(result);
    });
  return del;
} catch (err) {
  logger.error("Caught exception: ", err);

  return res.status(500).json({
    error: 'Something went wrong in catch, please try later..!'
  });
}

});

Router.post('/update', function(req, res) {
 try {
  let savedRecord=controller.updateJob(req.body,(err,result) => {
    if (err) {
      logger.error('Error in fetching entity ', err);
      return res.status(500).json({
        error: 'Something went wrong, please try later..!'
      });
    }

      //  SUCCESS
      console.log("from the updatejob server side :")
      console.log(result)
      return res.json(result);
    });
  return savedRecord;
} catch (err) {
  logger.error("Caught exception: ", err);

  return res.status(500).json({
    error: 'Something went wrong in catch, please try later..!'
  });
}

});

module.exports = Router;
