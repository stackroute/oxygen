#!/usr/bin/env node

'use strict';
const logger = require('./../../applogger');
const async = require('async');
const Request = require('superagent');
//@todo
// const startCrawlerMQ = require('./docOpenCrawlerEngine').startCrawler;
const datapublisher = require('../serviceLogger/redisLogger');
const engineColln = require('./../common/engineColln');
const client = require('redis').createClient();

const getURL = function (searchQuery, callback) {
    let engine = engineColln.ENGINES;
    let key = engineColln.KEYS;
    // let eng = searchQuery.engineID.split(' ');
    // let url = "https://www.googleapis.com/customsearch/v1?q=Class&cx="+engine+
    //             "&key="+key+"&exactTerms=Java" 
    let url = "https://www.googleapis.com/customsearch/v1?q=" + 
        searchQuery.concept + "&cx=" + engine + "&key=" + key + "&start=" 
        + searchQuery.start + "&exactTerms=" + searchQuery.domain;
    // if (searchQuery.siteSearch !== 'NONE') {
    //     url += "&siteSearch=" + searchQuery.siteSearch;
    // }
    // if (searchQuery.domain !== 'NONE') {
    //     url += "&exactTerms=" + searchQuery.domain;
    // }
    let searchResults = [];
    console.log(" " + url + " " + searchQuery.nbrOfResults);
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
                logger.debug("retrieved the " + data.items.length +
                    " document for concept " + searchQuery.concept);

                for (let k = 0; k < data.items.length; k += 1) {

                    // if ((i + k) <= searchQuery.nbrOfResults) {
                        let searchResult = {
                            // "jobID": searchQuery._id,
                            "query": searchQuery.concept,
                            "title": data.items[k].title,
                            "url": data.items[k].link,
                            "description": data.items[k].snippet
                        };
                        searchResults.push(searchResult);
            //         } else {
            //             break;
                    // }

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
    let key = searchEngineParams.domain+'&'+searchEngineParams.concept+'&'+searchEngineParams.start+'&'+searchEngineParams.nbrOfResults;
    key = key.replace(/ +/g, "_");
    logger.debug('Key: ', key);
    async.waterfall([
            async.apply(getURL, searchEngineParams),
            async.asyncify(function (urlResponse) {
                client.setex(key, 600, JSON.stringify(urlResponse), function(error){
                    if(error) {
                        logger.error('Error occured while setting data in redis cache..');
                    }
                });
                return urlResponse
            }),
            function (prevResponse, next) {
                logger.debug("prevResponse: ", prevResponse);
                logger.debug("next: ", next);
            }
        ]);

    // let sendData = function (errs, res) {
    //     if (errs) {
    //         logger.error("some error in google api :")
    //         logger.error(errs)
    //         return errs;
    //     }
    //     if (res.length !== 0) {
    //         res.map((ele) => {
    //             ele.map((data, i) => {
    //                 //send.push(data);
    //                 // let saveUrl=new searchModel(data);
    //                 // saveUrl.save(function (saveErr,savedObj) {
    //                 //  if (saveErr) {
    //                 //   logger.error(saveErr);
    //                 // }
    //                 // else {
    //                 logger.debug("sending " + i + " " + data.query);
    //                 let msgObj = {
    //                     domain: jobDetails.exactTerms,
    //                     concept: jobDetails.query,
    //                     url: data.url,
    //                     title: data.title,
    //                     description: data.description
    //                 };
    //                 //searchModel.close()
    //                 // startCrawlerMQ(msgObj);

    //                 let RedisSearch = {
    //                     domain: jobDetails.exactTerms,
    //                     actor: 'searcher',
    //                     message: jobDetails.query,
    //                     status: 'search completed'
    //                 }
    //                 datapublisher.processFinished(RedisSearch);
    //                 //ch.sendToQueue('hello', new Buffer(objId));
    //                 let redisCrawl = {
    //                     domain: jobDetails.exactTerms,
    //                     actor: 'crawler',
    //                     message: data.url,
    //                     status: 'crawl started for the url'
    //                 }
    //                 datapublisher.processStart(redisCrawl);
    //             })
    //         })
    //     }
    //     return {msg: "done on searcher and sent msg to crawler"};
    // }
    // return sendData;
}

const checkRecentlySearched = function(msg){
	let promise = new Promise(function(resolve, reject) {
		let result  = {
			msg: msg,
			isRecent: false
		}
		client.on("error", function (err) {
		    logger.error("Error in Redis:" + err);
		});
		client.get(msg, function(err, reply) {
			if(err) {
				logger.error("Error while fetching the id from the redis")
			}
			else if(reply != null) {
				result.isRecent = true
			}
		    // reply is null when the key is missing
		    console.log(reply);
		});

		// if (!result.isRecent) {
		// 	reject(err);
		// }
		
		resolve(result);
		
	})
	logger.debug("inside the checkRecentlySearched method",msg);
	return promise;
}

const fetchPrevSearchResult= function(searchEngineParams){
    let key = searchEngineParams.domain+'&'+searchEngineParams.concept+'&'+searchEngineParams.start+'&'+searchEngineParams.nbrOfResults;
    let promise = new Promise(function(resolve, reject) {
        client.on("error", function (err) {
            logger.error("Error in Redis:" + err);
        });
        client.get(key, function(err, cachedURLs){
            if (err) {
                reject(err);
            }
            resolve(cachedURLs);
        });
    })
    logger.debug("inside the fetchPrevSearchResult method",searchEngineParams);
    return promise;
}

module.exports = {
    storeURL: storeURL,
    getURL: getURL,
    checkRecentlySearched: checkRecentlySearched,
    fetchPrevSearchResult: fetchPrevSearchResult
};