  var app = require('../../server/webapp.service')();
  var expect = require('chai').expect;
  var assert = require('chai').assert;
  var request = require("supertest");
  var logger = require('./../../applogger');
  request = request(app);
  describe("Modifying the attributes of a predicate for specified subject and object  :", function() {
              it('when ', function(done) {
                  this.timeout(10000);
                  request
                      .put('http://localhost:8080/domain/Java Web Application Development/subject/Domain/Java Web Application Development/object/Intent/beginner/predicate/IntentOf')
                      .expect(200)
                      .end(function(err, res) {
                          logger.debug("response", res.body);
                          if (err) {
                              throw err;
                          }
                          //verify
                          done();
                      });
              });

              it('when all the nodes are orphan after deleting the specific node', function(done) {
                  this.timeout(10000);
                  request
                      .delete('/domain/Sports/subject/Intent/Cricket?cascade=0')
                      .expect(200)
                      .end(function(err, res) {
                          logger.debug("response", res.body);
                          if (err) {
                              throw err;
                          }
                          //verify
                          done();
                      });
              });

              it('when few of the nodes for that specific node will not become orphan', function(done) {
                  //   this.timeout(10000);
                  //   request
                  //       .delete('/domain/Sports/subject/Intent/Cricket?cascade=0')
                  //       .expect(200)
                  //       .end(function(err, res) {
                  //         logger.debug("response", res.body);
                  //           if (err) {
                  //             throw err;
                  //           }
                  //
                  //           //verify
                  //           done();
                  //       });
                  //
                  // });
              });

              describe("try passing a nodetype which is not a part of domain:", function() {
                  it('when nodename does not exist', function(done) {
                      .delete('/domain/Sports/subject/Intent/Golf?cascade=0')
                          .expect()
                  });
              });
