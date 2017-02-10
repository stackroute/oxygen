const neo4jDriver = require('neo4j-driver').v1;
const config = require('./../../config');
const logger = require('./../../applogger');
var connection=require('./noe4jConnection');
var session=connection.connectneo4j;

function one(){
  let query = 'create(n)'
  query+= 'return n'
  let params={};

  session.run(query, params).then(function(result)
  {
          if (result) {
            //  logger.debug(result);
          }
          session.close();

      })
      .catch(function(error) {
        //  logger.error("Error in NODE_CONCEPT query: ", error, ' query is: ', query);

      });
}
function two(){
  let query = 'create(n)'
  query+= ' return n'
  let params={};
  session.run(query, params).then(function(result)
  {
          if (result) {
              logger.debug(result);
          }
          session.close();

      })
      .catch(function(error) {
          logger.error("Error TYPE: ", error, ' query is: ', query);
          connection.reconnect();
          logger.error("Trying to reconnect");


      });
}

two();
