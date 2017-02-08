var app = require('../../server/webapp.service')();
var expect = require('chai').expect;
var assert = require('chai').assert;
var request = require("supertest");
var logger = require('./../../applogger');

request = request(app);

describe("Deleting an object when it's subject and relation are passed", function() {
    it('Testing for delete url :', function(done) {
        request
            .delete('/domain/Sports/subject/Intent/Cricket/object/Term/Batting/predicate/IndicatorOf')
            .expect(200)
            .end(function(err, result) {
                logger.debug('Response from the server', result);
            });

        //verify
        done();
    });

    it('Checking ',function(done){
        done();
    });
});
