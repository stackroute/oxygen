var app = require('../server/webapp.service')();
var expect = require('chai').expect;
var assert = require('chai').assert;
var request = require("supertest");
const logger = require('./../applogger');
request = request(app);

describe("deleting the orphan nodes, when a specific node is deleted :", function() {
    it('when there is no orphan nodes', function(done) {
        this.timeout(10000);
        request
            .delete('/domain/Sports/subject/Intent/Cricket?cascade=1')
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


describe("try passing a nodetype which is not a part of domain:", function(){
  it('when nodename does not exist' , function(done){
      .delete('/domain/Sports/subject/Intent/Golf?cascade=0')
      .expect()

  });

});
