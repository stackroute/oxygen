const neo4jDriver = require('neo4j-driver').v1;
const logger = require('./../../applogger');
const config = require('./../../config');
const graphConsts = require('./../common/graphConstants');

let driver = neo4jDriver.driver(config.NEO4J.neo4jURL,
  neo4jDriver.auth.basic(config.NEO4J.usr, config.NEO4J.pwd),{encrypted:false});

let getTreeOfDomain = function(data) {
  let promise = new Promise(function(resolve, reject) {
    logger.debug("Now proceeding to get all terms of domain: ", data.domain);

    let query = 'MATCH p=(n:concept)<-[:'+ graphConsts.REL_SUBCONCEPT_OF +']->(m) '+ 
                'where NOT ()<-[:'+ graphConsts.REL_SUBCONCEPT_OF +']-(n) set m.size=1' + 
                ' WITH COLLECT(p)  AS ps CALL apoc.convert.toTree(ps) yield value RETURN value'

    let params = {
      name: data.domain
    };
    let terms=[];
    let session = driver.session();
    session.run(query, params)
    .then(function(result) {
        // result.records.forEach(function(record) {
        //   record._fields.forEach(function(fields){
        //     terms.push(fields.properties.name);
        //   });
        // });
        console.log(result);

        session.close();
        logger.debug("tree from neo4j: ", result);
        data.interestedTerms=terms
        resolve(data);
      })
    .catch(function(err){
      logger.error("Error in neo4j query: ", err, ' query is: ',
        query);
      reject(err);
    })
  });

  return promise;
}

module.exports = {
  getTerms: getTerms
}
