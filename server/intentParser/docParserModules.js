var parserNeo4jCtrl=require('./docIntentParserNeo4jController');

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

  let  termkeys=Object.keys(data.allTerms);
  let indicator=0;
  let counter=0;

//check for alll trems indicator and counterIndicator
termkeys.forEach(function (term) {
  let word=termkeys[0];
  data.counterIndicatorTerms.forEach(function(cit)
  {
    if(word==cit)
    {
      counter++;
    }
  })

  data.indicatorTerms.forEach(function(it)
  {
    if(word==it)
    {
      indicator++;
    }
  })
})

let intensity=0;
if(indicator>0)
{
  let density=(indicator/(indicator+counter))*100;
  density=(density-50)*2;
  intensity=x;
}
else {
  intensity=0;
}
data.intensity=intensity;

return data;
}

let conceptDocumentRelationship=function(data){

  let promise=new Promise(
   function(resolve,reject){
     if(data) {
      logger.debug("Successfully added concept Document Relationship ",   data);
      resolve(data)
    }
    else {
      logger.error("Encountered error in adding concept Document Relationship ",
        err);
      reject("error occured");
    }
});//end of promise

  return promise;

}

module.exports = {
  fetchIntentSpecificTerms: fetchIntentSpecificTerms,
  findIntentIntensity:findIntentIntensity,
  conceptDocumentRelationship:conceptDocumentRelationship
}
