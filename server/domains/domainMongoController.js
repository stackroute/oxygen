const DomainModel = require('./domainEntity').DomainModel;

const logger = require('./../../applogger');

let saveNewDomain = function(newDomainObj) {
  let promise = new Promise(function(resolve, reject) {

    newDomainObj = new DomainModel(newDomainObj);

    newDomainObj.save(function(err, savedDomainObj) {
      if (err) {
        reject(err);
      }

      if (!savedDomainObj) {
        reject({
          error: "Null domain object created in mongo..!"
        });
      }

      resolve(savedDomainObj);
    });
  })

  return promise;
}

let checkDomain = function(domainName) {
  let promise = new Promise(function(resolve, reject) {

    domainObj = {
      name:domainName
    };

    DomainModel.findOne(domainObj,function(err, foundDomain) {
      if (err) {
        reject(err);
      }

      if (!foundDomain) {
        reject({
          error: "Null domain object while retriving the domain from mongo..!"
        });
      }
      resolve(foundDomain);
    });
  })

  return promise;
}

module.exports = {
  saveNewDomain: saveNewDomain,
  checkDomain:checkDomain
}
