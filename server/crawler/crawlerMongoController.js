
const webDocumentsModel = require('./webDocumentsEntity').webDocumentsModel;

const logger = require('./../../applogger');

let saveNewWebDocument = function(webDocument) {
  delete webDocument.text;
  delete webDocument.allTerms;
  delete webDocument.interestedTerms;
  webDocument.lastIndexedOn=new Date().toISOString();
  logger.debug("Saving the webDocument : ")
  logger.debug(webDocument)

  let promise = new Promise(function(resolve, reject) {

    //let saveWebDocument = new webDocumentsModel(webDocument);
    let query={
      url:webDocument.url
    }
    
    let options={
      new:true,
      upsert:true
    }

    webDocumentsModel.findOneAndUpdate(query,webDocument,options,function(err, data) {
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
