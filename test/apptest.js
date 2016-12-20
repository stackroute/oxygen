var moduleToTest = require('../server/crawler/crawlerNeo4jController').getTerms;
var expect = require('chai').expect;
describe("fetching terms from the domain", function() {
  let domainObj = {
    domain: "devOps",
    concept:"devOps"
  };

  it('get the Terms', function(done) {

    moduleToTest(domainObj)
    .then(
      function(dataToTest){
        console.log(dataToTest)
        expect(dataToTest).to.be.not.equal(undefined);
        expect(dataToTest.terms.length).to.be.at.least(1);
        done()
      },
      function(err){
        done(err)
      })
  });

}); //end of describe