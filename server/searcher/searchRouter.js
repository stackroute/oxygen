'use strict';
const logger = require('./../../applogger');
const Router = require('express').Router();
const controller = require('./searchController');

Router.get('/:jobID', function(req, res) {
  try {
    let sendData = controller.storeURL(req.params.jobID, (err, result) => {
      if (err) {

        logger.error('Error in fetching entity ', err);
        return res.status(500).json({
          error: 'Something went wrong, please try later..!'
        });
      }
      console.log("from the storeURL server side :")
      console.log(result)
        //  SUCCESS
      return res.json(result);
    });
    return sendData;
  } catch (err) {
    logger.error("Caught exception: ", err);
    return res.status(500).json({
      error: 'Something went wrong while pathing, please try later..!'
    });
  }


});

module.exports = Router;
