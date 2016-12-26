var redis = require('redis');
var client = redis.createClient(); 

var channelname = '';

publishLog = function(data) {
data_string = JSON.stringify(data);
channelname = 'oxygen:onServiceUpdate';
client.publish(channelname,data_string);
}

module.exports = {
  publishLog: publishLog
}