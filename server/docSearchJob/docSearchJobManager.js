let jobCtrl = require('./docSearchJobController');
const engineCollnData = require('./../common/engineColln');
const engineModel = require('./docSearchJobEntity').engineModel;
const logger = require('./../../applogger');
let kickOffDomainIndexing = function(conceptsColln) {

  // Kick off search jobs for each concept  
  let promise = new Promise(function(resolve, reject) {
    //Looping through for each given concept, as each concept should be one job
    process.nextTick(
      function(){

        let innerPromise=new Promise(function(innerResolve,innerReject){

          engineModel.find(function(err,data){
            if(data.length===0)
            {
              new engineModel({"engine":engineCollnData.ENGINES,"key":engineCollnData.KEYS}).save(
                function(saveError,engineData) {
                  if (saveError) {   
                    logger.error("saveError "+saveError);
                    innerReject(saveError)
                  }
                  logger.info("saved engine "+engineData);
                  innerResolve("Engine Collection Created")
                })
            }
            innerResolve("Engine Collection Already present")
          })

        })

        
        innerPromise.then(function(data){
          logger.debug(data);
          let selector=0;          
          conceptsColln.Concepts.forEach(function(concept) {

            logger.debug("inside the domain indexing "+concept)
            if(selector!==engineCollnData.KEYS.length-1)
            {
              jobCtrl.addSearchJob(conceptsColln.Domain, concept,selector);
              selector+=1;
            }
            else
            {
              selector=0;
              jobCtrl.addSearchJob(conceptsColln.Domain, concept,selector);
            }
            
          })
          resolve({msg:'searcher and crawler finished their work'});

        },
        function(err)
        {
          reject({msg:'faced some internal error',error:err});
        }
        )       
      });   
  });

  return promise;
}

module.exports = {
  kickOffDomainIndexing: kickOffDomainIndexing
}
