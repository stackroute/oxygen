const parserNeo4jCtrl=require('./docIntentParserNeo4jController');

const logger = require('./../../applogger');

let fetchIntentSpecificTerms=function(data){

  let promise=new Promise(
   function(resolve,reject){
     parserNeo4jCtrl.fetchIndicatorTerms(data)
     .then(function(dataObj) {
      logger.debug("Successfully fetched indicator Terms ",
        dataObj);
      parserNeo4jCtrl.fetchCounterIndicatorTerms(dataObj).then(function(dataObj1) {
        logger.debug("Successfully fetched counter indicator Terms ",
          dataObj1);
        resolve(dataObj1);
      },
      function(err) {
        logger.error("Encountered error in fetching counter Indicator Terms ",
          err);
        reject(err);
      });
    },
    function(err) {
      logger.error("Encountered error in fetching indicator Terms ",
        err);
      reject(err);
    });

});//end of promise

  return promise;

}

let findIntentIntensity=function(data){

  logger.debug("All the Terms "+data.terms);

  let indicator=0;
  let counter=0;

//check for alll trems indicator and counterIndicator
data.terms.forEach(function(term) {
  logger.debug("The prop "+ term.word);
  for (let counterItr in data.counterIndicatorTerms) {

    if(term.word===data.counterIndicatorTerms[counterItr])
    {
      counter+=term.intensity;
    }
  }

  for (let indicatorItr in data.counterIndicatorTerms)
  {
    if(term.word===data.indicatorTerms[indicatorItr])
    {
      indicator+=term.intensity;
    }
  }
})

logger.debug("after calculation of counter "+ counter);
logger.debug("after calculation of indicator "+ indicator);
let intensity=0;
if(indicator>0)
{
  let density=(indicator/(indicator+counter))*100;
  density=(density-50)*2;
  intensity=density;
}
else {
  intensity=0;
}
logger.debug("after calculation of rating "+ intensity);
data.intensity=intensity;

return data;
}

let conceptDocumentRelationship=function(data){

  let promise=new Promise(
   function(resolve,reject){
     parserNeo4jCtrl.addIntentRelationship(data).then(function(dataObj1) {
       logger.debug("Successfully added concept Document Relationship ",
         dataObj1);
       resolve(dataObj1);
     },
     function(err) {
       logger.error("Encountered error in adding concept Document Relationship",
         err);
       reject(err);
     });
});//end of promise
  return promise;

}

module.exports = {
  fetchIntentSpecificTerms: fetchIntentSpecificTerms,
  findIntentIntensity:findIntentIntensity,
  conceptDocumentRelationship:conceptDocumentRelationship
}
