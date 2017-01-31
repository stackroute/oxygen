var app = require('../server/webapp.service')();
var expect = require('chai').expect;
var assert = require('chai').assert;
var request = require("supertest");
var TermsToTest = require('../server/domains/domainNeo4jController').getTermsIntendsCallback;

request = request(app);
describe("Make get requests for terms", function() {
    it('Simple post Request to root url', function(done) {
        request.get('/').expect(200, done);
        });
       it('Testing for not defined route', function(done) {
        request.get('/_undefined_route').expect(404, done);
        this.timeout(10000)
         });
});
describe("testing", function(){
   it('content length', function(done){
       request.get('/domain/:intentName/terms')
       .expect('Content-Length', '37', done)
   });
    it('content type', function(done){
       request.get('/domain/:intentName/terms')
       .expect('Content-Type', /json/, done)
   });
});