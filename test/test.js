var app = require('../server/webapp.service')();
var expect = require('chai').expect;
var assert = require('chai').assert;
var request = require("supertest");
var deleteToTest = require('../server/domains/domainNeo4jController').getDeleteRelationCallback;

request = request(app);

describe("Make get requests to delete ", function() {
	it('Simple post Request to root url', function(done) {
		request.get('/').expect(200, done);

	});

	it('Testing for not defined route', function(done) {
		request.get('/_undefined_route').expect(404, done);
		this.timeout(10000)

	});
});

// describe("Make GET requests to intent :", function() {
// 	it('Testing for all intent', function(done) {
// 		request.get('/domain/add/intent').expect(200, done);
// 		this.timeout(10000);
// 	});
// });


// describe("Make GET requests to intent along with intent name ", function() {
// 	it('Testing for a intent which is not present', function(done) {
// 		request.get('/domain/nullIntent').
// 		expect({ error: 'Null intent object while retriving the intent from mongo..!' }, done);
// 		this.timeout(10000);
// 	});
// });
//

describe("testing", function(){
    it('content length', function(done){
        request.post('/domain/delete/relation')
        .expect('Content-Length', '218', done)
    });

		it('content type', function(done){
        request.post('/domain/delete/relation')
        .expect('Content-Type', /json/)
				done();
    });
});

describe("Make GET requests to deleteRelation :", function() {
    it('Testing for all relations', function(done) {
        request.post('/domain/delete/relation').expect(200, done);
        this.timeout(10000);
    });
});


describe("Make POST requests to delete relation along with relation name", function(){
	it('Testing for a relation which is  present', function(done){
		request.post('/domain/delete/relation').
		expect({error: 'relations are deleted from mongo'})
		done();
	});
});

describe("fetching relation which is not present", function() {
	let deleteObj = {
		domain: "no_domain",
		concept:"no_domain"
	};

	it('trying to get the relation of domain which is not there', function() {

		request.post('/domain/introduction/terms').
		expect({error: 'relations are deleted from mongo'})

		//expect(Object.keys(intentToTest(intentObj))).to.have.lengthOf(0);

	});

}); //end of describe
