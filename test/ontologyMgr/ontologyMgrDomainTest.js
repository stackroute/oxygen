var app = require('../../server/webapp.service')();
var expect = require('chai').expect;
var assert = require('chai').assert;
var request = require("supertest");
var logger = require('./../../applogger');

request = request(app);

describe("Testing Api which fetches all Subject details of Domain", function() {
    it('If domain is present', function(done) {
        request
            .get('/domain/Java Web Application Development/subjects')
            .expect(200)
            .end(function(err, res) {
              if(err) expect(true);
              expect(res.body).to.have.property('attributes');
              done();
            });
    });
    it('If domain is not present', function(done) {
        request
            .get('/domain/Java Web Appliction Development/subjects')
            .expect(200)
            .end(function(err, res) {
              expect(res.body).to.have.property('attributes');
            });
            done();
    });
});


describe("Posting properties to a node", function() {
    it('If domain is present', function(done) {
        request
            .patch('')
            .expect(200)
            .end(function(err, res) {
              if(err) expect(true);
              expect(res.body).to.have.property('attributes');
              done();
            });
    });
});
