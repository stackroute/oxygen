var app = require('../server/webapp.service')();
var expect = require('chai').expect;
var assert = require('chai').assert;
var request = require("supertest");
var intentToTest = require('../server/domains/intentNeo4jController').getPublishIntentCallback;
var mongoose = require('mongoose');
var config = require('./config-debug');

request = request(app);

describe("Make GET requests to intent ", function() {
	it('Simple GET Request to root url', function(done) {
		request.get('/').expect(200, done);

	});

	it('Testing for not defined route', function(done) {
		request.get('/_undefined_route').expect(404, done);
		this.timeout(10000)

	});
});

describe('Routing', function() {
//  var url = 'http://localhost:8080';
  // within before() you can run all the operations that are needed to setup your tests. In this case
  // I want to create a connection with the database, and when I'm done, I call done().
  it('mongoose check',function(done) {
    // In our tests we use the test db
    mongoose.connect(config.db.mongodb)
    done();
  });

describe("testing", function(){
	it('content length', function(done){
		request.post('/domain/add/intent')
		.expect('Content-Length', '34', done)
	});
	it('content type', function(done){
		request.post('/domain/add/intent')
		.expect('Content-Type', /json/, done)
	});
});
describe("testing for terms", function(){
	it('Content-Length', function(done){
		request.post('/domain/add/term')
		.expect('Content-Length','32',done)
	});
	it('Content-Type',function (done){
		request.post('/domain/add/term')
		.expect('Content-Type',/json/, done)
	});
});

describe("testing term connection", function(){
	it('Testing for all terms', function(done){
		request.post('/domain/add/intent').expect(200, done);
		this.timeout(10000);
	});
});

describe("Make GET requests to intent :", function() {
	it('Testing for all intent', function(done) {
		request.post('/domain/add/intent').expect(200, done);
		this.timeout(10000);
	});
});

describe("should be an intent with keys and values", function(){
	it('Testing for all key value pairs', function(done){
		request.get('/domain/add/intent')
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




describe("Make GET requests to intent along with intent name ", function() {
	it('Testing for a intent which is not present', function(done) {
		request.get('/domain/add/nullIntent').
		expect({ error: 'Resource not found' }, done);
		this.timeout(10000);
	});
});



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
