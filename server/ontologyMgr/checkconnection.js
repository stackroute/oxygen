const neo4jDriver = require('neo4j-driver').v1;
const config = require('./../../config');
const logger = require('./../../applogger');
var connection=require('./noe4jConnection');
var session=connection.connectneo4j;

function two(){
  let query = 'create(n)'
  query+= ' return n'
  let params={};
  session
  .run("MERGE (alice:Person {name : {nameParam} }) RETURN alice.name", { nameParam:'Alice' })
  .subscribe({
    onNext: function(record) {
     console.log(record._fields);
    },
    onCompleted: function() {
      // Completed!
      session.close();
    },
    onError: function(error, callback) {
      console.log(error);
      callback=()=>{ two()
      }
    }
  });

}

two();
module.exports.two=two;
