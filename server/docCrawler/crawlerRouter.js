'use strict';
const logger = require('./../../applogger');
const Router = require('express').Router();
const controller = require('./../crawler/docCrawlerEngineController');
const crawlerController = require('./crawlerController');

Router.get('/:urlID', function (req, res) {
    try {
        let sendData = controller.getData(req.params.urlID, (err, result) => {
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

Router.post('/doc', function (req, res) {
    try {
        let interestedTerms = [];
        interestedTerms.push(req.body.terms);
        let crawlerObj = req.body;
        crawlerObj.interestedTerms = interestedTerms;

        logger.debug('post request',crawlerObj);

        crawlerController.crawlDocument(crawlerObj)
            .then(function (relativeWeights) {
                    res.send(relativeWeights);
                    return;
                },
                function (err) {
                    logger.error("Encountered error in crawling document: ",err);
                    res.status(500).send({
                        error: 'Failed to complete the crawling operation...!'
                    });
                    return;
                });
    } catch (err) {
        logger.error("Caught a error in crawling document ", err);
        res.status(500).send({
            error: "Something went wrong in crawling document, please try later..!"
        });       return;
    }
});

Router.get('/', function (req, res) {

    return res.status(200).json({
        data: 'im workinggg'
    });

});
module.exports = Router;
