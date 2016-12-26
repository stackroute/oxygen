const webDocumentsModel = require('./webDocumentsEntity').webDocumentsModel;

const logger = require('./../../applogger');

let saveNewWebDocument = function(webDocument) {
  delete webDocument.text;
  delete webDocument.allTerms;
  logger.debug("Saving the webDocument : ")
  logger.debug(webDocument)

  let promise = new Promise(function(resolve, reject) {

    let saveWebDocument = new webDocumentsModel(webDocument);

    saveWebDocument.save(function(err, data) {
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
