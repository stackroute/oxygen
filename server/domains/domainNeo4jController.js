const DomainModel = require('./domainEntity').DomainModel;

const neo4jDriver = require('neo4j-driver').v1;

const logger = require('./../../applogger');

let indexNewDomain = function(newDomainObj) {
  let promise = new Promise(function(resolve, reject) {

    logger.debug("Now proceeding to index new domain: ", newDomainObj);

    let driver = neo4jDriver.driver(('bolt://192.168.99.100'),
      neo4jDriver.auth.basic('neo4j', 'password')
    );
    let session = driver.session();

    logger.debug("obtained connection with neo4j");

    let query = 'MERGE (d:Domain {name:{domainName}}) return d';
    let params = {
      domainName: newDomainObj.name
    };

    session.run(query, params)
      .then(function(result) {
        result.records.forEach(function(record) {
          logger.debug("Result from neo4j: ", record);
        });

        // Completed! 
        session.close();
        resolve(newDomainObj);
      })
      .catch(function(err) {
        logger.error("Error in neo4j query: ", err, ' query is: ',
          query);
        reject(err);
      });
  });

  return promise;
}

let indexNewDomainCallBack = function(newDomainObj, callback) {
  indexNewDomain(newDomainObj).then(function(indexedDomainObj) {
    callback(null, indexedDomainObj);
  }, function(err) {
    callback(err, null);
  });
}

module.exports = {
  indexNewDomain: indexNewDomain,
  indexNewDomainCallBack: indexNewDomainCallBack
}
