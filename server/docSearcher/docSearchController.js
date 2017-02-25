#!/usr/bin/env node

'use strict';
const logger = require('./../../applogger');
const async = require('async');
const Request = require('superagent');
//@todo
const datapublisher = require('../serviceLogger/redisLogger');
const engineColln = require('./../common/engineColln');
const client = require('redis').createClient();
const config = require('./../../config');

const getURL = function (searchQuery, i, callback) {
    let engine = engineColln.ENGINES[i];
    let key = engineColln.KEYS[i];
    logger.debug("Engine:", engine);
    logger.debug("Key:", key);
    // let eng = searchQuery.engineID.split(' ');
    let url = "https://www.googleapis.com/customsearch/v1?q=" +
        searchQuery.concept + "&cx=" + engine + "&key=" + key + "&start="
        + searchQuery.start + "&exactTerms=" + searchQuery.domain +
        "&num=" + searchQuery.nbrOfResults;
    // if (searchQuery.siteSearch !== 'NONE') {
    //     url += "&siteSearch=" + searchQuery.siteSearch;
    // }
    // if (searchQuery.domain !== 'NONE') {
    //     url += "&exactTerms=" + searchQuery.domain;
    // }
    let searchResults = [];
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
            // if (typeof data !== "undefined") {
                logger.debug("retrieved the " + data.items.length +
                    " document for concept " + searchQuery.concept);

                for (let k = 0; k < data.items.length; k += 1) {

                    // if ((i + k) <= searchQuery.nbrOfResults) {
                    if (k <= searchQuery.nbrOfResults) {
                        let searchResult = {
                            // "jobID": searchQuery._id,
                            "domain": searchQuery.domain,
                            "concept": searchQuery.concept,
                            "title": data.items[k].title,
                            "url": data.items[k].link,
                            "description": data.items[k].snippet
                        };
                        searchResults.push(searchResult);
                    } else {
                        break;
                    }

                }
                callback(null, searchResults);
            }
        });
}


/*
 searchEngineParams ??
 */
const getGoogleResults = function (searchEngineParams, selector) {
    let stack = [];
    let key = generateKey(searchEngineParams);
    let promise = new Promise(function(resolve, reject) {
        async.waterfall([
            async.apply(getURL, searchEngineParams, selector),
            async.asyncify(function (urlResponse) {
                logger.debug("Key of storeURL: ", key)
                client.setex(key, config.CACHE_EXPIRY_TIME, JSON.stringify(urlResponse), function(error){
                    if(error) {
                        logger.error('Error occured while setting data in redis cache..');
                    }
                });
                resolve(urlResponse);
            })
        ]);
    })
    return promise;
}

const checkInRecentlySearched = function(searchEngineParams){
	let promise = new Promise(function(resolve, reject) {
        let result = {
            msg: searchEngineParams,
            isRecent: false,
            results: []
        }
		client.on("error", function (err) {
		    logger.error("Error in Redis:" + err);
		});

        let key = generateKey(searchEngineParams);

        client.get(key, function(err, reply) {

			if(err) {
				logger.error("Error while fetching the id from the redis ", err);
                reject(err);
			}
            else if(reply != null) {
                result.isRecent = true
                result.results = JSON.parse(reply);
                client.setex(key, config.CACHE_EXPIRY_TIME, reply, function(error){
                    logger.debug("Updating the cache expiry time");
                    if(error) {
                        logger.error('Error occured while setting data in redis cache..');
                    }
                });
            }
            resolve(result);
		}); //end of getting key/value from redis
	}); //end of promise
	return promise;
}

function generateKey (searchEngineParams) {
    let key = searchEngineParams.domain+'&'+searchEngineParams.concept+'&'+searchEngineParams.start+'&'+searchEngineParams.nbrOfResults;
    return key.replace(/ +/g, "_");
}

module.exports = {
    getGoogleResults: getGoogleResults,
    getURL: getURL,
    checkInRecentlySearched: checkInRecentlySearched
    // fetchPrevSearchResult: fetchPrevSearchResult
};
