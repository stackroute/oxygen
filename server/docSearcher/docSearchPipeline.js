const logger = require('./../../applogger');
const config = require('./../../config');
const amqp = require('amqplib');
const highland = require('highland');
const controller = require('./docSearchController');
const checkRecentlySearched = require('./docSearchController').checkRecentlySearched;
const fetchPrevSearchResult = require('./docSearchController').fetchPrevSearchResult;

const startSearcher = function() {
  	let amqpConn = amqp.connect(config.RABBITMQ.rabbitmqURL);

  	amqpConn
	.then(function(conn) {
  		logger.info('[*] Connected to AMQP successfully..!');
  		return conn.createChannel();
	})
	.then(function(chConn) {
  		logger.info('[*] Established AMQP Channel connection successfully..!');
  		//making durable as false, so that .....
  		chConn.assertQueue(config.OXYGEN.SEARCHER_MQ_NAME, { durable: false })
		.then(function(ok) {
  			logger.debug('[*] Waiting for messages on [' + config.OXYGEN.SEARCHER_MQ_NAME +
    		'], to exit press CTRL+C ');

    		highland(function(push, next) {
    			logger.info('In highland function generator')
    			chConn.consume(config.OXYGEN.SEARCHER_MQ_NAME, function(msg) {
    				logger.info('Inside Searcher_MQ consumer')
    				const dataObj = {
                  		data: msg.content.toString()
                	};
    				push(null, dataObj)
    				next();
    			}, { noAck: true });
    		})
    		.map(function (dataObj) {
    			logger.debug("Got message in pipe: ", dataObj);
    			return dataObj;
    		})
    		.map(function(dataObj) {
			    logger.info("Entered in checkRecentlySearched function");
			    let promise = controller.checkRecentlySearched(dataObj)
			    return promise;
			})
			.flatMap(promise => highland(
		    	promise
		    	.then(function(result) {
		    		if(result.isRecent) {
		    			logger.info("Fetching the previously stored data");
	    				let promise = controller.fetchPrevSearchResult(result)
	    				return promise;
	    			} else {
	    				logger.info("Check on google with the given domain and concepts");
	    			}
		    	}, function(err) {
		      		return err;
		    	})
		  	))
		  	// .flatMap(promise => highland(

		  	// ))
    		.each(function(promise) {
    			logger.info('Highland function ends')
    		})
    	})
    })
}

module.exports = {
  startSearcher: startSearcher
};