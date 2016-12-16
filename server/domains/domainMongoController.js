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
          error: 'Null domain object created in mongo..!'
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

let getDomainObj = function(domainName, callback) {
  let query = {
    name: domainName
  };

  DomainModel.findOne(query, callback);

  return;
}

let updateDomainStatus = function(domainName, status, statusText, callback) {
  getDomainObj(domainName, function(err, domainObj) {
    if (err) {
      logger.error('Error in finding the domain object: ', domainName);
      return;
    }

    if (!domainObj) {
      logger.error('Found null domain object for updating status...!');
    }

    domainObj.updatedOn = Date.now();
    domainObj.status = status;
    domainObj.statusText = statusText;

    domainObj.save(callback);
  });
}

module.exports = {
  saveNewDomain: saveNewDomain,
  saveNewDomainCallBack: saveNewDomainCallBack,
  updateDomainStatus: updateDomainStatus,
  getDomainObj: getDomainObj
}
