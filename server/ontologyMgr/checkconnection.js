const neo4jDriver = require('neo4j-driver').v1;
const config = require('./../../config');
const logger = require('./../../applogger');
var connection = require('./noe4jConnection');
var session = connection.connectneo4j;

function two() {
    let query = 'create(n)';
    query += ' return n';
    let params = {};
    session
        .run('MERGE (alice:Person {name : {nameParam} }) RETURN alice.name', {
            nameParam: 'Alice'
        })
        .subscribe({
            onNext: function(record) {
                logger.debug(record);
            },
            onCompleted: function() {
                // Completed!
                session.close();
            },
            onError: function(error, callback) {
                logger.error(error);
            }
        });
}

two();
module.exports.two = two;
