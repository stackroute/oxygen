var app = require('../../server/webapp.service')();
var expect = require('chai').expect;
var request = require("supertest");
var logger = require('./../../applogger');

request = request(app);

const neo4jDriver = require('neo4j-driver').v1;
const config = require('./../../config');
describe('driver', function() {
  var driver;
  it('should expose sessions', function() {
    // Given
    let driver = neo4jDriver.driver(config.NEO4J.neo4jURL,
            neo4jDriver.auth.basic(config.NEO4J.usr, config.NEO4J.pwd), {
                encrypted: false
            }
        );

    // When
    var session = driver.session();

    // Then
    expect(session).to.exist;
    // done();
    driver.close();
  });

  it('should handle connection errors', function(done) {
    // Given
    driver = neo4jDriver.driver("bolt://localhoste", neo4jDriver.auth.basic("neo4j", "password"));

    // Expect
    driver.onError = function (err) {
      //the error message is different whether in browser or node
      expect(err.message).not.toBeNull();
      done();
    };

    // When
    driver.session();
  });

  it('should handle wrong scheme', () => {
    expect(() => neo4jDriver.driver("tank://localhost", neo4jDriver.auth.basic("neo4j", "password")))
      .to.throw(new Error('Unknown scheme: tank://'));
  });

  it('should handle URL parameter string', () => {
    expect(() => neo4jDriver.driver({uri: 'bolt://localhost'})).to.throw(Error(TypeError));

    expect(() => neo4jDriver.driver(['bolt:localhost'])).to.throw(Error(TypeError));

    expect(() => {
      const driver = neo4jDriver.driver(String('bolt://localhost', neo4jDriver.auth.basic("neo4j", "password")));
      return driver.session();
    }).toBeDefined();
});

it('should fail early on wrong credentials', function(done) {
    // Given
    driver = neo4jDriver.driver("bolt://localhost", neo4jDriver.auth.basic("neo4j", "who would use such a password"));

    // Expect
    driver.onError = function (err) {
      //the error message is different whether in browser or node
      expect(err.fields[0].code).toEqual('Neo.ClientError.Security.Unauthorized');
      done();
    };

    // When
    driver.session();
});
});
