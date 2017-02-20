var app = require('../../server/webapp.service')();
var expect = require('chai').expect;
var assert = require('chai').assert;
var request = require("supertest");
var logger = require("./../../applogger");
request = request(app);
let reqObj = {
	"subname": "tempIntent",
	"subtype": "Intent",
	"props": {
		"Sika": "dika",
		"Hoka": "Hola"
	}
};
let reqObjChange = {
	"subname": "tempIntent",
	"subtype": "Intent",
	"props": {
		"Sikas": "dika",
		"Hokas": "Hola"
	}
};
let subjectObject = {
	"objname": "tempTerm",
	"objtype": "Term",
	"attributes": {
		"Sika": "dika",
		"Hoka": "Hola"
	},
	"predicate": {
		"name": "indicatorOf",
		"attributes": {
			"weight": 0.6
		}
	}
};

describe('Creating Resource', function() {
  it('If it does not exist', function(done){
    let url = '/domain/Java Web Application Development/resource';
    request
    .post(url)
    .send(reqObj)
    .end(function(err,res){
      if(err) {
        logger.debug('herre');
        expect(true);
      }
      expect(res.body.name).to.equal(reqObj['subname']);
      done();
    });
  });
  it('If it exists and edited Some properties', function(done){
    let url = '/domain/Java Web Application Development/resource';
    request
    .post(url)
    .send(reqObjChange)
    .end(function(err,res){
      if(err) {
        logger.debug('herre');
        expect(true);
      }
      expect(res.body.name).to.equal(reqObj['subname']);
      done();
    });
  });
  it('If no such domain', function(done){
    let url = '/domain/Java Wplication Development/resource';
    request
    .post(url)
    .send(reqObjChange)
    .end(function(err,res){
      if(err) {
        expect(true);
      }
      logger.debug(res.body);
      expect(res.body.err).to.equal('No Domain');
    });
    done();
  });
});

describe('Forming Statement', function() {
  it('If given object details are good', function(done){
    let url = '/domain/Java Web Application Development/subject/Intent/tempIntent/object';
    request
    .post(url)
    .send(subjectObject)
    .end(function(err,res){
      if(err) {
        logger.debug('Hrerer');
        expect(true);
      }
      logger.debug(res.body);
      expect(res.body).to.equal(subjectObject['objname']);
    });
    done();
  });
  it('If Subject is not present', function(done){
    let url = '/domain/Java Web Application Development/subject/Intent/temptent/object';
    request
    .post(url)
    .send(subjectObject)
    .end(function(err,res){
      if(err) {
        expect(true);
      }
      logger.debug(res.body);
      expect(res.body.err).to.equal('No Subject');
    });
    done();
  });
});
