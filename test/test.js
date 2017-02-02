var app = require('../server/webapp.service')();
var expect = require('chai').expect;
var assert = require('chai').assert;
var request = require("supertest");
var TermsToTest = require('../server/domains/domainNeo4jController').getTermsIntendsCallback;
var intentToTest = require('../server/domains/intentNeo4jController').getPublishIntentCallback;

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

describe("checking number of parameters" ,function(){
  it('checking', function(done){
    expect(5).to.equal(5);
  });
});

describe("testing", function() {
    it('content length', function(done) {
        request.get('/domain/:intentName/terms')
            .expect('Content-Length', '53', done)
    });
    it('content type', function(done) {
        request.get('/domain/:intentName/terms')
            .expect('Content-Type', /json/, done)
    });
});



describe("Make GET requests to deleteRelation :", function() {
    it('Testing for all relations', function(done) {
        request.post('/domain/delete/relation').expect(200, done);
        this.timeout(10000);
    });
});


describe('A basic test', function(){
  it('should pass when everything is ok' ,function(){
    expect(true).to.be.true;

  });

});



describe("Make POST requests to delete relation along with relation name", function(){
	it('Testing for a relation which is  present', function(done){
		request.post('/domain/delete/relation').
		expect({error: 'relations are deleted from mongo'})
		done();
	});
});




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




describe("Make GET requests to intent along with intent name ", function() {
    it('Testing for a intent which is not present', function(done) {
        request.get('/domain/nullIntent').
        expect({
             error: 'Null domain object while retriving the domain from mongo..!'
        }, done);
        this.timeout(10000);
    });
});


describe("testing", function(){
	it('content length', function(done){
		request.post('/domain/all/intents')
		.expect('Content-Length', '30', done)
	});
	it('content type', function(done){
		request.post('/domain/all/intents')
		.expect('Content-Type', /json/, done)
	});
});
describe("testing for terms", function(){
	it('Content-Length', function(done){
		request.post('/domain/all/term')
		.expect('Content-Length','30',done)
	});
	it('Content-Type',function (done){
		request.post('/domain/all/term')
		.expect('Content-Type',/json/, done)
	});
});

describe("testing term connection", function(){
	it('Testing for all terms', function(done){
		request.post('/domain/all/term').expect(200, done);
		this.timeout(10000);
	});
});

describe("Make GET requests to intent :", function() {
	it('Testing for all intent', function(done) {
		request.post('/domain/all/intents').expect(200, done);
		this.timeout(10000);
	});
});

describe("should be an intent with keys and values", function(){
	it('Testing for all key value pairs', function(done){
		request.post('/domain/all/intents')
		.set('Accept', 'application/json')
		// .send({
		// 	domain : "JavaScript",
		// 	intent : "ExpressJs"
		// })
		.expect(200)
		.end(function(err,res){
			expect(res.body).to.have.property("Domain");
			expect(res.body.Domain).to.not.equal(null);
			expect(res.body).to.have.property("intent");
			expect(res.body.intent).to.not.equal(null);
			done();
		});
	});
});


describe("Make POST requests to intents along with intent name", function() {
    it('Testing for a intent which is not present', function(done) {
        request.post('/domain/all/intents').
        expect({
            error: 'Intents are not added from mongo'
        })
        done();
    });
});

// describe("fetching terms from the intent which is not present", function() {
//     let intentObj = {
//         domain: "no_domain",
//         intent: "no_domain"
//     };
//
//     it('trying to get the Terms of intent which is not there', function() {
//
//         //	expect(Object.keys(intentToTest(intentObj))).to.have.lengthOf(0);
//         request.post('/domain/introduction/terms').
//         expect({
//             error: 'Intent is not present'
//         })
//     });


// describe("fetching terms from the intent which is not present", function() {
// 	let intentObj = {
// 		domain: "no_domain",
// 		intent: "no_domain"
// 	};
//
// 	it('trying to get the Terms of intent which is not there', function() {
//
//
// 		expect(Object.keys(intentToTest(intentObj))).to.have.lengthOf(0);
// 	});
//
// }); //end of describe
