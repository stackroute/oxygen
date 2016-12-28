var io = require('socket.io')();
var redis = require('redis');
var appConfig = require('../config/');
var logger = require('../applogger');

var redisClient = undefined;

io.on('connection', function(socket) {
  logger.debug("subscribing to client socket connection..!");

  if (!redisClient) {
    redisClient = redis.createClient({
      host: appConfig.REDIS_SERVER.host,
      port: appConfig.REDIS_SERVER.port
    });
  }

  //subscribe to common updates from all the services (actors) of Oxygen
  redisClient.subscribe('oxygen:onServiceUpdate');

  redisClient.on('message', function(channel, chDataStr) {
    var chData = JSON.parse(chDataStr);
    
    logger.debug("Got message from channel ", channel, " data is: ", chData);

    //create socketEvent
    // var socketEventName = 'oxygen::progressUpdate' + '::' + chData.domainName;
    var socketEventName = 'oxygen::progressUpdate';
    var socketEventData = {
      'data': chData,
    };

    logger.debug('Emiting Socket event: ', socketEventName, ' data: ', socketEventData);
    socket.emit(socketEventName, socketEventData);

  });

  socket.on('disconnect', function() {
    if (redisClient) {
      redisClient.unsubscribe();
      redisClient.quit();
      redisClient = undefined;
    }
  });
});

module.exports = io;