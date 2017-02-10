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
        // Get the Singleton instance if one exists
        // or create one if it doesn't
        getInstance: function() {
            if (!instance) {
                instance = init();
            }
            return instance;
            console.log(instance);
        }
    };
}());
let connectneo4j = SingletonNeo4j.getInstance();

let reconnect=function(){
  if (count <= 5) {
          setInterval(SingletonNeo4j.init, 5000);
          logger.debug('Connection retrying after 5 seconds');
          count++;
      }
      else {
          logger.debug('Connection exhausted');
          process.exit();
      }
}
module.exports = {
    connectneo4j: connectneo4j,
    reconnect:reconnect
    // connectRedis:connectRedis
    // connectWithMongoose: connectWithMongoose
};
// Creating redis connection
// var SingletonRedis = (function(){
//   var instance;
//   function init(){
//     client = require('redis').createClient(config.redis.port,config.redis.host);
//   };
//
//   return {
//     // Get the Singleton instance if one exists
//     // or create one if it doesn't
//     getInstance: function () {
//       if ( !instance ) {
//         instance = init();
//       }
//       return instance;
//     }
//   };
//
// })();
//  let connectRedis=SingletonRedis.getInstance();

// Connecting with mongoose
/* var connectWithMongoose = function() {
  return mongoose.connect(mongoUrl, function(err) {
    if (err) {
      console.error('Failed to connect to mongo on startup - retrying in 5 sec', err);
      setTimeout(connectWithRetry, 5000);
    }
  });
};
connectWithMongoose();*/
