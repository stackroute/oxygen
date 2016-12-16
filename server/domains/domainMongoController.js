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

let saveNewDomainCallBack = function(newDomainObj, callback) {
  saveNewDomain(newDomainObj)
    .then(
      function(savedDomainObj) {
        callback(null, savedDomainObj);
      },
      function(err) {
        callback(err, null);
      });
}

module.exports = {
  saveNewDomain: saveNewDomain,
  saveNewDomainCallBack: saveNewDomainCallBack
}
