var app = require('../../server/webapp.service')();
var expect = require('chai').expect;
var assert = require('chai').assert;
var request = require("supertest");
var logger = require("./../../applogger");
request = request(app);
let domainName = 'Java Web Application Development';
let nodeC = 'concept';
let nodeI = 'intent';
describe("testing for objects", function(){
  it("get objects",function(done){
    let url='/domain/' + domainName + '/subject/'+ nodeI + '/trouble shooting/objects';
    request.get(url)
    .expect(200)
    .end(function(err,res){
      logger.debug("response" , res.body);
      if(err){
        //throw res.body;
      }
      expect(res.body);
      done();
    })
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
describe("testing for intent which is not present", function(){
  it("domain not present",function(done){
    request.get('/domain/JavaScript/subject/intent/troubleshg/objects')
    .expect(200)
    .end(function(err, res) {
           logger.debug("response", res.body);
             if (err) {
               throw err;
             }
             expect(res.body).to.have.property('err');
              })
              done();
       });
     });

describe("testing for concept", function(){
  it("domain is present",function(done){
    let url='/domain/' +domainName + '/subject/' + nodeC + '/app instances/objects';
    request.get(url)
    .expect(200)
    .end(function(err,res){
      logger.debug("response" , res.body);
      if(err){
        expect(res.body).to.have.property('attributes');
      }
      expect(res.body).to.have.property('attributes');
      })
      done();
  })
});

describe("testing for intent which is not present", function(){
  it("domain is present",function(done){
    let url= '/domain/' +domainName + '/subject/' + nodeI + '/instances/objects';
    request.get(url)
    .expect(200)
    .end(function(err,res){
      logger.debug("response" , res.body);
      expect(res.body).to.have.property('err');

    })
    done();
  });
});

describe("testing for concept which is not present", function(){
  it("domain not present",function(done){
  let url = '/domain/JavaScript/subject/' + nodeC + '/java/objects';
     request.get(url)
    .expect(200)
    .end(function(err,res){
      logger.debug("response" , res.body);
      expect(res.body).to.have.property('err');

    })
    done();
  })
});
describe("testing", function() {
    it('content length', function(done) {
        request.get('/domain/Java Web Application Development/subject/intent/trouble shooting/objects')
            .expect('Content-Length', '359');
            done();
    });
    it('content type', function(done) {
        request.get('/domain/Java Web Application Development/subject/intent/trouble shooting/objects')
            .expect('Content-Type', /json/);
            done();
    });

});
