const DomainModel = require('./domainEntity').DomainModel;
const webDocumentModel = require('./../crawler/webDocumentsEntity').webDocumentsModel;
const logger = require('./../../applogger');

let saveNewDomain = function(newDomainObj) {
  let promise = new Promise(function(resolve, reject) {

    let saveDomainObj = new DomainModel(newDomainObj);

    saveDomainObj.save(function(err, savedDomainObj) {
      if (err) {
        reject(err);
      }

      if (!savedDomainObj) {
        reject({
          error: 'Null domain object created in mongo..!'
        });
      }
      logger.debug("saved man")
      resolve(savedDomainObj);
    });
  })

  return promise;
}

let checkDomain = function(domainName) {
  let promise = new Promise(function(resolve, reject) {

    let domainObj = {
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

let getAllDomain = function() {
 let promise = new Promise(function(resolve, reject) {

   DomainModel.find({},function(err, domainColln) {
     if (err) {
       reject(err);
     }

     logger.debug('domains',domainColln);
     resolve(domainColln);
   });
 })

 return promise;

}

let getSearchResultDocuments = function(url) {
  let promise = new Promise(function(resolve, reject) {

    let urlObj = {
      url:url
    };


    webDocumentModel.findOne(urlObj,function(err, foundDocument) {
      if (err) {
        reject(err);
      }

      resolve(foundDocument);
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


let checkDomainCallback = function(domainName, callback) {
  checkDomain(domainName)
  .then(
    function(foundDomain) {
      callback(null, foundDomain);
    },
    function(err) {
      callback(err, null);
    });
}

let getAllDomainsCallback = function(callback) {
 getAllDomain()
 .then(
   function(domainColln) {
     callback(null, domainColln);
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
  checkDomain:checkDomain,
  getAllDomain:getAllDomain,
  getAllDomainsCallback:getAllDomainsCallback,
  checkDomainCallback:checkDomainCallback,
  saveNewDomainCallBack: saveNewDomainCallBack,
  updateDomainStatus: updateDomainStatus,
  getDomainObj: getDomainObj,
  getSearchResultDocument:getSearchResultDocuments

}
