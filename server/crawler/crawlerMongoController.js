const webDocumentsModel = require('./domainEntity').webDocumentsModel;

const logger = require('./../../applogger');

let saveNewWebDocument = function(webDocument) {
  let promise = new Promise(function(resolve, reject) {

    webDocument = new DomainModel(webDocument);

    webDocument.save(function(err, data) {
      if (err) {
        reject(err);
      }

      if (!data) {
        reject({
          error: 'Null domain object created in mongo..!'
        });
      }

      resolve(data);
    });
  })

  return promise;
}


module.exports = {
  saveNewWebDocument: saveNewWebDocument
}
