'use strict';
const logger = require('./../../applogger');



const checkRecentlySearched = function(dataObj){
	let promise = new Promise(function(resolve, reject) {
		let result  = {
			isRecent: true
		}
		if (!result.isRecent) {
			reject(err);
		}
		
		resolve(result);
		
	})
	logger.debug("inside the checkRecentlySearched method",dataObj);
	return promise;
}

const fetchPrevSearchResult= function(dataObj){
	let promise = new Promise(function(resolve, reject) {

		if (err) {
			reject(err);
		}

		resolve();
		
	})
	logger.debug("inside the fetchPrevSearchResult method",dataObj);
	return promise;

}

module.exports = {
  checkRecentlySearched: checkRecentlySearched,
  fetchPrevSearchResult: fetchPrevSearchResult
};
