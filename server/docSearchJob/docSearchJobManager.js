let jobCtrl = require('./docSearchJobController');
const config = require('./../../config');
const engineModel = require('./docSearchJobEntity').engineModel;

let kickOffDomainIndexing = function(conceptsColln) {

  // Kick off search jobs for each concept  
  let promise = new Promise(function(resolve, reject) {
    console.log(conceptsColln)
    //Looping through for each given concept, as each concept should be one job
    process.nextTick(
      function(){

        let promise=new Promise(function(resolve,reject){

          engineModel.find(function(err,data){
            if(data.length===0)
            {
              new engineModel({"engine":config.ENGINES,"key":congig.KEYS}).save(
                function(err,data) {
                  if (err) {   
                    console.log("err "+err);
                    reject(err)
                  }
                  console.log("saved engine "+data);
                  resolve(1)
                })
            }
            resolve(0)
          })

        })

        
        promise.then(function(data){
          conceptsColln.Concepts.forEach(function(concept) {
            console.log("inside the domain indexing "+concept)
            jobCtrl.addSearchJob(conceptsColln.Domain, concept);
          })
          resolve({msg:'searcher and crawler finished their work'});

        },
        function(err)
        {
          reject({msg:'faced some internal error'});
        }
        )       
      });   
  });

  return promise;
}

module.exports = {
  kickOffDomainIndexing: kickOffDomainIndexing
}
