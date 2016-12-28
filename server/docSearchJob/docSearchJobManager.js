let jobCtrl = require('./docSearchJobController');
const config = require('./../../config');
const engineModel = require('./docSearchJobEntity').engineModel;
const logger = require('./../../applogger');
let kickOffDomainIndexing = function(conceptsColln) {

  // Kick off search jobs for each concept  
  let promise = new Promise(function(resolve, reject) {
    console.log(conceptsColln)
    //Looping through for each given concept, as each concept should be one job
    process.nextTick(
      function(){

        let innerPromise=new Promise(function(innerResolve,innerReject){

          engineModel.find(function(err,data){
            if(data.length===0)
            {
              new engineModel({"engine":config.ENGINES,"key":config.KEYS}).save(
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
          conceptsColln.Concepts.forEach(function(concept) {
            logger.debug("inside the domain indexing "+concept)
            jobCtrl.addSearchJob(conceptsColln.Domain, concept);
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
