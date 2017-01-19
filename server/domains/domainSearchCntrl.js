const logger = require('./../../applogger');
// const searchModel = require('./../searcher/searchEntity').searchModel;
const sendToSearcherQueue=require('./openSearcherMq').sendToSearcherQueue;
const config = require('./../../config');

const addSearch = function(domainName,concept,selector) {
	logger.debug('addSearch','fetching reqdata')
	logger.debug(domainName+" "+concept)
	let reqData={
		query: concept,
		// engineID: engineData.engine[selector]+" "+engineData.key[selector],
		exactTerms: domainName,
		results: config.NO_OF_RESULTS,
		siteSearch: 'NONE'

	}		
	logger.debug('Before search queue');
	sendToSearcherQueue(config.RABBITMQ.rabbitmqURL, config.OXYGEN.SEARCHER_MQ_NAME, reqData);
					
};
module.exports = {
 addSearch: addSearch
};
