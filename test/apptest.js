var app = require('../server/webapp.service')();
//var app2 = require('../server/crawler/crawlerRouter');
var expect = require('chai').expect;
var assert = require('chai').assert;

//Supertest is a library to test apps, which have API endpoints or Request/Response based
//Supertest wraps "Superagent", HTTP request/response library for server side
var request = require("supertest");

//Initilise supertest to tes the module, which you want to test 
request = request(app);

//Make GET request to URL "/" and get a 200 res within 10ms
//describe -> testscenario
describe("Make GET requests to domain ", function() {
  console.log("hi");
  //it -> testcase
  it('Simple GET Request to root url', function(done) {
    console.log("test run");
    request.get('/').expect(200, done);

  });

  it('Testing for not defined route', function(done) {
    console.log("test run 2");
    request.get('/_undefined_route').expect(404, done);
    this.timeout(10000)

  });
});

describe("Make GET requests to domain ", function() {
  it('Testing for all domains', function(done) {
    console.log("test run 3");
    request.get('/domain').
    expect('Content-Type', 'application/json; charset=utf-8', done);
  });
});


describe("Make GET requests to domain along with domain name ", function() {
  it('Testing for a domain which is not present', function(done) {
    console.log("test run 4");
    request.get('/domain/java').
    expect({ error: 'Null domain object while retriving the domain from mongo..!' }, done);
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
      })
      //   .expect(200, done)
      // this.timeout(10000)
      .end(function(err, res) {
        expect(Object.keys(res.body)).to.have.lengthOf(5);
        done();
        this.timeout(10000);

      });
  });

});


describe("Make GET requests to docSearchJob ", function() {
  console.log("inside docSearchJob");
  //it -> testcase
  it('Simple GET Request to root url', function(done) {
    console.log("test run");
    request.get('/').expect(200, done);
  });
});


describe("Make POST request to add jobs ", function() {
  it('Simple POST request test for adding job', function(done) {
    console.log("test run");
    request.post('/docsearchjob/job')
      .send({
        query: "react",
        engineID: "Engine-A",
        exactTerms: "jsx",
        results: "4",
        siteSearch: "NONE"
      })
      .end(function(err, res) {
        expect(Object.keys(res.body)).to.have.lengthOf(6);
        done();
      });
  });
});

describe("Make GET request to show the results ", function() {
  it('Simple GET request test for viewing all the results', function(done) {
    console.log("test run");
    request.get('/docsearchjob/show')
      .end(function(err, res) {
        expect('Content-Type', 'application/json; charset=utf-8', done);
        done();
      });
  });

});

describe("Make GET request to show the results ", function() {
  it('Simple GET request test for viewing the results for a particular job id', function(done) {
    console.log("test run");
    request.get('/docsearchjob/585cb4cf0384402018145166')
      .end(function(err, res) {
        expect('Content-Type', 'application/json; charset=utf-8', done);
        done();
        this.timeout(10000);

      });
  });
  it('Simple GET request test for viewing the results for a wrong job id', function(done) {
    console.log("test run");
    request.get('/docsearchjob/rr585cb4cf0384402018145166')
      .end(function(err, res) {
        expect({
          error: 'Something went wrong, please try later..!'
        }, done);
        done();


      });
  });

});











//end of describe


// var app2 = require('../server/doccrawl.service');
// var app = require('../server/crawler/crawlerRouter')
// var expect = require('chai').expect;
// var request = require("supertest");
// request = request(app);

// var mongoose = require('mongoose');
// // var baseurl = `http://localhost:8080/#/jobResult/`;
// request = request(baseurl);

// describe(' checking routes', function() {

//   it("should return status ok", function(done) {
//     request
//       .get('/58513e46ee386645e85eb1a8')
//       .expect(200, done)
//   });

//   it("should return 404 ", function(done) {
//     request
//       .post('/abc')
//       .expect(404, done)
//   });

//   it('Get a URL record', function(done) {

//     var urlObj = {
//       "query": "waste",
//       "title": "Waste - Wikipedia",
//       "url": "https://en.wikipedia.org/wiki/Waste",
//       "description": "Waste and wastes are unwanted or unusable materials. Waste is any substance \nwhich is discarded after primary use, or it is worthless, defective and of no use.",
//       "intent": [''],
//       "newWords": [''],
//       "concept": ['']

//     };

//     request.get('/58495db2b4db9029e4d4d877')
//       .expect(200)
//       .end(function(err, res) {
//         expect(res.body.query).to.be.equal(urlObj.query);
//         expect(res.body.title).to.be.equal(urlObj.title);
//         expect(res.body.url).to.be.equal(urlObj.url);
//         expect(res.body.description).to.be.equal(urlObj.description);
//         expect(res.body.intent).to.be.equal(urlObj.intent);
//         expect(res.body.newWords).to.be.equal(urlObj.newWords);
//         expect(res.body.concept).to.be.equal(urlObj.concept);
//         done();
//       });
//   });
// });
// var app2 = require('../server/webapp.service')();
// //var router = require('../server/domains/domainRouter')
// var expect = require('chai').expect;
// var request = require("supertest");
// request = request(app2);

// describe("A basic test", function() {
//   it('should pass everything', function(done) {
//     request.get('/domains/domainRouter').expect(200, done);
//     //expect(true).to.be.true;
//     //this.timeout(10000);

//   });

// });
// var chai = require('chai');
// var expect = require('chai').expect;
// var chaiHttp = require('chai-http');
// var server = require('../server/webapp.service')();
// var should = chai.should();

// chai.use(chaiHttp);


// describe('Blobs', function() {
//   //it('should list ALL blobs on /blobs GET');
//   // it('should list a SINGLE blob on /blob/<id> GET');
//   // it('should add a SINGLE blob on /blobs POST');
//   // it('should update a SINGLE blob on /blob/<id> PUT');
//   // it('should delete a SINGLE blob on /blob/<id> DELETE');

//   it('should list ALL blobs on /blobs GET', function(done) {
//     chai.request(server)
//       .get('/')
//       .expect(200, done);
//     // .end(function(err, res) {
//     //   console.log("hi")
//     //   res.should.have.status(200);
//     //   done();
//   });

// });







// var app = require('../doccrawl.service');
// var expect = require('chai').expect;
// var mongoose = require('mongoose');

// //Supertest is a library to test apps, which have API endpoints or Request/Response based
// //Supertest wraps "Superagent", HTTP request/response library for server side
// var request = require("supertest");

// //Initilise supertest to tes the module, which you want to test 
// request = request(app);

// //Make GET request to URL "/" and get a 200 res within 10ms
// //describe -> testscenario
// describe("URL Testing Suite", function() {

//   it('Get a URL record', function(done) {

//     var urlObj = {
//       "query": "waste",
//       "title": "Waste - Wikipedia",
//       "url": "https://en.wikipedia.org/wiki/Waste",
//       "description": "Waste and wastes are unwanted or unusable materials. Waste is any substance \nwhich is discarded after primary use, or it is worthless, defective and of no use.",
//       "intent": ['basic'],
//       "newWords": ['waste'],
//       "concept": ['management']
//     };

//     request.get("/crawlerService/" + '58495db2b4db9029e4d4d877')
//       .expect(200)
//       .end(function(err, res) {
//         expect(res.body.query).to.be.equal(urlObj.query);
//         expect(res.body.title).to.be.equal(urlObj.title);
//         expect(res.body.url).to.be.equal(urlObj.url);
//         expect(res.body.description).to.be.equal(urlObj.description);
//         expect(res.body.intent).to.be.equal(urlObj.intent);
//         expect(res.body.newWords).to.be.equal(urlObj.newWords);
//         expect(res.body.concept).to.be.equal(urlObj.concept);


//         done();
//       });
//   });

// }); //end of describe
