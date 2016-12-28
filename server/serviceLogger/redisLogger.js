const redis = require('redis');
const config = require('./../../config');

const client = redis.createClient(config.REDIS_PORT, config.REDIS_HOST); 

const processStart = function(data){
	let channelName = 'oxygen:onServiceUpdate';
	publishLog(channelName, data);
}

const processFinished = function(data){
	let channelName = 'oxygen:onServiceUpdate';
	publishLog(channelName, data);
}

const publishLog = function(channelname, data) {
	dataStr = JSON.stringify(data);
	client.publish(channelname, dataStr);
}

module.exports = {
  processStart: processStart,
  processFinished: processFinished
}