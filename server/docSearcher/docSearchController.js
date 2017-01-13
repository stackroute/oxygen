'use strict';
const logger = require('./../../applogger');



const checkRecentlySearched = function(dataObj){

logger.debug("inside the checkRecentlySearched method",dataObj);
return dataObj;
}

const fetchPrevSearchResult= function(dataObj){
	logger.debug("inside the fetchPrevSearchResult method",dataObj);
	return dataObj;
}

module.exports = {
  checkRecentlySearched: checkRecentlySearched,
  fetchPrevSearchResult: fetchPrevSearchResult
 
};
