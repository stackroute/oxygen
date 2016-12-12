'use strict';
const logger = require('./../../applogger');
const Router = require('express').Router();
const controller = require('./docCrawlerEngineController');

Router.get('/:urlID', function(req, res) {
  try {
    let sendData=controller.getData(req.params.urlID, (err, result) => {
      if (err) {
        logger.error('Error in fetching entity ', err);
        return res.status(500).json({
          error: 'Something went wrong, please try later..!'
        });
      }

      console.log("from the refineData server side :")
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
Router.get('/', function(req, res) {

    return res.status(200).json({
      data: 'im workinggg'
    });

});
module.exports = Router;
