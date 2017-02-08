const logger = require('./../../applogger');
// const searchModel = require('./../searcher/searchEntity').searchModel;
const sendToSearcherQueue=require('./openSearcherMq').sendToSearcherQueue;
const config = require('./../../config');

const addSearch = function(domainName,concept,selector) {
	logger.debug('addSearch','fetching reqdata')
	logger.debug(domainName+" "+concept)
	let reqData={
		concept: concept,
		// engineID: engineData.engine[selector]+" "+engineData.key[selector],
		domain: domainName,
		start: 1,
		nbrOfResults: config.NO_OF_RESULTS
	}
	logger.debug('Before search queue');
	sendToSearcherQueue(config.RABBITMQ.rabbitmqURL, config.OXYGEN.SEARCHER_MQ_NAME, reqData);

};
module.exports = {
 addSearch: addSearch
};
