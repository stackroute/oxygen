var app = require('../server/webapp.service')();
var expect = require('chai').expect;
var assert = require('chai').assert;
var request = require("supertest");
var moduleToTest = require('../server/crawler/crawlerNeo4jController').getTerms;
var moduleForTest = require('../server/ontologyMgr/noe4jConnection');
request = request(app);
describe("Make GET requests to domain ", function() {
    it('Simple GET Request to root url', function(done) {
        request.get('/').expect(200, done);
    });
    it('Testing for not defined route', function(done) {
        request.get('/_undefined_route').expect(404, done);
        this.timeout(10000)
    });
});
describe("Make GET requests to domain :", function() {
    it('Testing for all domains', function(done) {
        request.get('/domain').expect(200, done);
        this.timeout(10000);
    });
});
describe("Make GET requests to domain along with domain name ", function() {
    it('Testing for a domain which is not present', function(done) {
        request.get('/domain/nullDomain').
        expect({
            error: 'Null domain object while retriving the domain from mongo..!'
        }, done);
        this.timeout(10000);
    });
});
describe("Make post requests to domain along with domain name ", function() {
    it("Testing for publishing a new domain it should return status", function(done) {
        request
            .post('/domain/java')
            .send({
                "name": "Java",
                "description": "No description",
                "domainImgURL": "no url"
            }).end(function(err, res) {
                if (err) {
                    done(err);
                }
                expect(Object.keys(res.body)).to.be.not.equal(undefined);
                done();
                this.timeout(10000);
            });
    });
});
describe("fetching concepts from the domain which is not present", function() {
    let domainObj = {
        domain: "no_domain",
        concept: "no_domain"
    };
    it('trying to get the Terms of domain which is not there', function() {
        expect(Object.keys(moduleToTest(domainObj))).to.have.lengthOf(0);
    });
}); //end of describe

describe("fetching intents from the domain which is not present", function() {
    let domainObj = {
        domain: "Java",
        intent: "no_intent"
    };
    it('trying to get the intents of domain which is not there', function() {
        expect(Object.keys(moduleToTest(domainObj))).to.have.lengthOf(0);
    });
}); //end of describe

describe("fetching terms from the intents which is not present", function() {
    let intentObj = {
        intent: "no_intent",
        term: "no_term"
    };
    it('trying to get the terms of intents which is not there', function() {
        expect(Object.keys(moduleToTest(intentObj))).to.have.lengthOf(0);
    });
}); //end of describe
