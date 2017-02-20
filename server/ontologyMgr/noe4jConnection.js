const neo4jDriver = require('neo4j-driver').v1;
const amqp = require('amqplib/callback_api');
const config = require('./../../config');
const logger = require('./../../applogger');
var client = '';
var amqpConn = null;
let count = 0;
var instance;
var SingletonNeo4j = (function() {
    function init() {
        let driver = neo4jDriver.driver(config.NEO4J.neo4jURL,
            neo4jDriver.auth.basic(config.NEO4J.usr, config.NEO4J.pwd), {
                encrypted: false
            }
        );
        driver.onCompleted = function(error, callback) {
          logger.debug('Connection retrieved Successfully');
        };
        driver.onError = function(error, callback) {
        logger.debug('Driver instantiation failed', error);
          if(count < 6) {
            logger.debug('while count' + count);
          setTimeout(callback = ()=> { SingletonNeo4j.getInstance();
            logger.debug('Connection retrying after 5 seconds');
              count++;
          }, 20000);}
          if (count == 6) {
            logger.debug('Connection exhausted');
            process.exit(0);
          }
        };
        let session = null;
      //  logger.debug('Session' + session);
        session = driver.session();
        logger.debug('Session ' + session);
        logger.debug('Driver ' + driver);
        return session;
    }
    return {
        getInstance: function() {
          instance = init();
            return instance;
        }
    };
}());
let connectneo4j = SingletonNeo4j.getInstance();

module.exports = {
    connectneo4j: connectneo4j
};

/*
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
var SingletonRedis = (function() {
    var instance;

    function init() {
        client = require('redis').createClient(config.REDIS.port, config.REDIS.host);
        return client;
    };

    return {
        getInstance: function() {
            if (!instance) {
                instance = init();
            }
            console.log(instance);
            return instance;
        }
    };

})();
let connectRedis = SingletonRedis.getInstance();*/
