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
      logger.debug("The prop  "+ term.word+ " intensity "+term.intensity);
  for (let counterItr in data.counterIndicatorTerms) {

    if(term.word===data.counterIndicatorTerms[counterItr].term)
    {
      logger.debug("This is the counter word "+ term.word+ " intensity "+term.intensity);
      counter+=(term.intensity)*(data.counterIndicatorTerms[counterItr].weight);
    }
  }

  for (let indicatorItr in data.indicatorTerms)
  {
    if(term.word===data.indicatorTerms[indicatorItr].term)
    {
      logger.debug("This is the counter word "+ term.word+ " intensity "+term.intensity);
      indicator+=(term.intensity)*(data.indicatorTerms[indicatorItr].weight);
    }
  }
})

logger.debug("after calculation of counter "+ counter);
logger.debug("after calculation of indicator "+ indicator);
let intensity=indicator-counter;
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
