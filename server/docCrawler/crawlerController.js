'use strict';
const fs = require('fs');
const async = require('async');
const request = require('request');
const cheerio = require('cheerio');
const keyword_extractor = require("keyword-extractor");
const logger = require('./../../applogger');
const crawlerModules = require('./crawlerModules');

let crawlDocument = function (domain) {
    let promise = new Promise(function (resolve, reject) {
        async.waterfall([
                function(callback){
                    parseText(domain, callback);
                },
                function(modelObj, callback){
                  extractData(modelObj, callback);
                }
            ],
            function (err, relativeWeights) {
                if (err) {
                    reject(err);
                }
                logger.info('relativeWeights: ', relativeWeights);
                resolve(relativeWeights);
            });
    });
    return promise;
}

let parseText = function (dataObj, callback) {
    let promise = new Promise(function (resolve, reject) {
        request.get(dataObj.url, function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    // logger.debug('parseText: ', body);
                    let page = cheerio.load(body);
                    if (typeof dataObj.title === 'undefined' || typeof dataObj.description === 'undefined') {
                        let meta = page('meta'),
                            keys = Object.keys(meta);
                        let ogType, ogTitle, desc;

                        logger.debug("fetching the title/description for the url : " + dataObj.url)
                        keys.forEach(function (key) {
                            if (meta[key].attribs && meta[key].attribs.property &&
                                meta[key].attribs.property === 'og:type') {
                                ogType = meta[key].attribs.content;
                            }
                        });
                        keys.forEach(function (key) {
                            if (meta[key].attribs && meta[key].attribs.property &&
                                meta[key].attribs.property === 'og:title') {
                                ogTitle = meta[key].attribs.content;
                            }
                        });
                        keys.forEach(function (key) {
                            if (meta[key].attribs && meta[key].attribs.property &&
                                meta[key].attribs.property === 'og:description') {
                                desc = meta[key].attribs.content;
                            }
                        });
                        if (ogTitle && desc) {
                            dataObj.title = ogTitle;
                            dataObj.description = desc;
                            logger.debug(ogType);
                            logger.debug(ogTitle);
                            logger.debug(desc);
                        }
                        else {
                            logger.debug('cheerio also returned null');
                            dataObj.title = dataObj.concept;
                            dataObj.description = 'Not Mentioned';
                        }
                    }
                    let text = page('body').text();
                    // logger.debug('this is the text ' + text);
                    text = text.replace(/\s+/g, ' ')
                        .replace(/[^a-zA-Z ]/g, '')
                        .toLowerCase();
                    logger.debug('created texts for ' + dataObj.url);
                    dataObj.text = text;
                } else {
                    logger.error("[ THIS IS NOT AN ERROR ] sry the url " + dataObj.url + " is not responding")
                }
                callback(null, dataObj);
                resolve(dataObj);
            },
            function (err) {
                reject(err);
            })
    })
    return promise;
}

const extractData = function (data, callback) {
    let promise = new Promise(function (resolve, reject) {
        async.waterfall([
            /* get the DOM MODEL to traverse the web document accordingly */
            async.apply(readFile, data),
            async.asyncify(function (modelObj) {

                modelObj = JSON.parse(modelObj);
                logger.debug("modelObj parsing", modelObj);
                logger.debug("Extracting the content from the URL");


                // let txt = keyword_extractor.extract(data.text, {
                //     language: "english",
                //     remove_digits: true,
                //     return_changed_case: true,
                //     remove_duplicates: false
                // })
                // data.text = txt;
                logger.debug('txt', data);
                let termOptimalWeight = 0;
                let terms = [];
                data.interestedTerms.forEach(function (item, index) {
                    let termWeight = crawlerModules.createTreeOfWebDocLike(data.text, modelObj, item);
                    logger.debug("termWeight: ", termWeight);
                    logger.debug("Interested Terms ", data.interestedTerms[index])
                    termOptimalWeight = parseInt(termWeight.maxWeight) + parseInt(termWeight.totalWeight);
                    logger.debug("termOptimalWeight: ", termOptimalWeight);
                    terms.push({
                        word: data.interestedTerms[index],
                        intensity: termOptimalWeight,
                        pathWeights: termWeight.pathWeights 
                    });
                })
                data.terms = terms;
                callback(null, data);
            })
        ]);
    })
    return promise;
}

const readFile = function (data, callback) {
    fs.readFile('cypher.json', function (err, data) {
        callback(null, data.toString());
    })
}

module.exports = {
    crawlDocument: crawlDocument
}
