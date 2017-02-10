const neo4jDriver = require('neo4j-driver').v1;
const config = require('./../../config');
const logger = require('./../../applogger');
var client = '';
let count = 0;

var SingletonNeo4j = (function() {
    var instance;
    function init() {
        let driver = neo4jDriver.driver(config.NEO4J.neo4jURL,
            neo4jDriver.auth.basic(config.NEO4J.usr, config.NEO4J.pwd), {
                encrypted: false
            }
        );
        let session = driver.session();
        logger.debug('  obtained connection with neo4j');
        count = 0;
        return session;

    }

    return {
        getInstance: function() {
            if (!instance) {
                instance = init();
            }
            return instance;
        }
    };
}());
let connectneo4j = SingletonNeo4j.getInstance();


// Connecting with mongoose
function setupMongooseConnections() {
  mongoose.connect(config.MONGO.mongoURL);

  mongoose.connection.on('connected', function() {
    logger.debug('Mongoose is now connected to ', config.MONGO.mongoURL);
  });

  mongoose.connection.on('error', function(err) {
    logger.error('Error in Mongoose connection: ', err);
  });

  mongoose.connection.on('disconnected', function() {
    logger.debug('Mongoose is now disconnected..!');
  });

  process.on('SIGINT', function() {
    mongoose.connection.close(function() {
      logger.info(
        'Mongoose disconnected on process termination'
        );
      process.exit(0);
    });
  });
}

// Creating redis connection in single ton
var SingletonRedis = (function(){
  var instance;
  function init(){
    client = require('redis').createClient(config.REDIS.port,config.REDIS.host);
    return client;
  };

  return {
    getInstance: function () {
      if ( !instance ) {
        instance = init();
      }
      console.log(instance);
      return instance;
    }
  };

})();
let connectRedis=SingletonRedis.getInstance();

module.exports = {
    connectneo4j: connectneo4j,
    connectRedis: connectRedis,
    setupMongooseConnections: setupMongooseConnections
};



let reconnect = function() {
    if (count <= 5) {
        setInterval(SingletonNeo4j.getInstance(), 5000);
        logger.debug('Connection retrying after 5 seconds');
        count++;
    } else {
        logger.debug('Connection exhausted');
        process.exit();
    }
}
