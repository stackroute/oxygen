#!/usr/bin/env node

'use strict';
const logger = require('./../../applogger');
const async = require('async');
const Request = require('superagent');
//@todo
const startCrawlerMQ = require('./docOpenCrawlerEngine').startCrawler;

const getURL = function (searchQuery, i, callback) {
    let eng = searchQuery.engineID.split(' ');
    let url = "https://www.googleapis.com/customsearch/v1?q=" + searchQuery.query + "&cx=" + eng[0] + "&key=" + eng[1] + "&start=" + i;
    if (searchQuery.siteSearch !== 'NONE') {
        url += "&siteSearch=" + searchQuery.siteSearch;
    }
    if (searchQuery.exactTerms !== 'NONE') {
        url += "&exactTerms=" + searchQuery.exactTerms;
    }
    let searchResults = [];
    console.log(i + " " + url + " " + searchQuery.results);
    Request
        .get(url)
        .end(function (err, body) {
            let data;
            if (err) {
                logger.error("encountered error while communicating with the google api :")
                logger.error(err);
                callback(err, null);
            } else {
                data = JSON.parse(body.text);
            }

            if (typeof data !== "undefined" && Object.keys(data).length === 6) {
                logger.debug("retrived the" + data.items.length +
                    "document for concept" + searchQuery.query);

                for (let k = 0; k < data.items.length; k += 1) {

                    if ((i + k) <= searchQuery.results) {
                        let searchResult = {
                            "jobID": searchQuery._id,
                            "query": searchQuery.query,
                            "title": data.items[k].title,
                            "url": data.items[k].link,
                            "description": data.items[k].snippet
                        };
                        searchResults.push(searchResult);
                    } else {
                        break;
                    }

                    //@todo srini will store the logs in mongo db
                }
                callback(null, searchResults);
            }
        });
}


/*
 searchEngineParams ??
 */
const storeURL = function (searchEngineParams) {
    let stack = [];

    async.waterfall([
            async.apply(getURL, searchEngineParams),
            async.asyncify(function (urlResponse) {
                return db.model.create(contents);
            }),
            function (prevResponse, next) {

            }
        ]
    );

    let sendData = function (errs, res) {
        if (errs) {
            logger.error("some error in google api :")
            logger.error(errs)
            return errs;
        }
        if (res.length !== 0) {
            res.map((ele) => {
                ele.map((data, i) => {
                    //send.push(data);
                    // let saveUrl=new searchModel(data);
                    // saveUrl.save(function (saveErr,savedObj) {
                    //  if (saveErr) {
                    //   logger.error(saveErr);
                    // }
                    // else {
                    logger.debug("sending " + i + " " + data.query);
                    let msgObj = {
                        domain: jobDetails.exactTerms,
                        concept: jobDetails.query,
                        url: data.url,
                        title: data.title,
                        description: data.description
                    };
                    //searchModel.close()
                    startCrawlerMQ(msgObj);

                    let RedisSearch = {
                        domain: jobDetails.exactTerms,
                        actor: 'searcher',
                        message: jobDetails.query,
                        status: 'search completed'
                    }
                    datapublisher.processFinished(RedisSearch);
                    //ch.sendToQueue('hello', new Buffer(objId));
                    let redisCrawl = {
                        domain: jobDetails.exactTerms,
                        actor: 'crawler',
                        message: data.url,
                        status: 'crawl started for the url'
                    }
                    datapublisher.processStart(redisCrawl);
                })
            })
        }
        return {msg: "done on searcher and sent msg to crawler"};
    }
    return sendData;
}

module.exports = {
    storeURL: storeURL,
    getURL: getURL
};