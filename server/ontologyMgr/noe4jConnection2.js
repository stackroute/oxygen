let neo4jDriver = require('neo4j-driver').v1;
const config = require('./../../config');

let driver = neo4jDriver.driver(config.NEO4J.neo4jURL,
    neo4jDriver.auth.basic(config.NEO4J.usr, config.NEO4J.pwd), {
        encrypted: false
    }
);
//let result;
var connectWithNeo4j = function() {
  return driver.session(result, function(err) {
    if(result){
      console.log("Connection established")
    }
    if (err) {
      console.error('Failed to connect to mongo on startup - retrying in 5 sec', err);
      setTimeout(connectWithNeo4j, 5000);
    }
  });
};
connectWithNeo4j();
