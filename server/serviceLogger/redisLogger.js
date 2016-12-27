var redis = require('redis');
const config = require('./../../config');
var client = redis.createClient(config.REDIS_PORT,config.REDIS_HOST); 

var channelname = '';


const publishOnServiceStart = function(data){
publishLog(data);
}

const publishOnServiceEnd = function(data){
publishLog(data);
}

publishLog = function(data) {
data_string = JSON.stringify(data);
channelname = 'oxygen:onServiceUpdate';
client.publish(channelname,data_string);
}

module.exports = {
  publishOnServiceStart: publishOnServiceStart,
  publishOnServiceEnd: publishOnServiceEnd
}