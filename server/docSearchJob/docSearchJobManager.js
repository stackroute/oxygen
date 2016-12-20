let jobCtrl = require('./docSearchJobController');

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
              const engines=[
              '009216953448521283757:ibz3hdutpom',
              '015901048907159908775:bu8jkb0g1c0',
              '017039332294312221469:tjlfw4hfuwc',
              '007705081896440677668:8luezkczozo',
              '004518674028755323320:ld85zhatuxc'
              ];
              const keys=[
              'AIzaSyDY5SnIb4vsmGwteTes7VPbi_1_TFV-T1U',
              'AIzaSyBb4sbJNrnGmPmHiwEOxtF_ZEbcRBzNr60',
              'AIzaSyAkZ_luP7pNchE_V2EMeiw2AwE7kKmbQVY',
              'AIzaSyC7XMsUPGIaHo1rT0nIAYWuQZGNEZdRabs',
              'AIzaSyA1hzOwDP99Vse-JuHrX7erfgUi3RT8f10',
              ];
              new engineModel({"engine":engines,"key":keys}).save(
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
