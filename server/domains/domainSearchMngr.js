let searchCtrl = require('./domainSearchCntrl');
const engineCollnData = require('./../common/engineColln');
const logger = require('./../../applogger');
let kickOffDomainIndexing = function(conceptsColln) {
  // Kick off search jobs for each concept
  let promise = new Promise(function(resolve, reject) {
    //Looping through for each given concept, as each concept should be one job
          let selector=0;
          conceptsColln.Concepts.forEach(function(concept) {

            logger.debug("inside the domain indexing "+concept)
            if(selector!==engineCollnData.KEYS.length-1)
            {
              logger.debug('kickoff inside if');
              searchCtrl.addSearch(conceptsColln.Domain, concept,selector);
              selector+=1;
            }
            else
            {
              logger.debug('kickoff inside else');
              selector=0;
              searchCtrl.addSearch(conceptsColln.Domain, concept,selector);
            }
            resolve({msg:'Concepts sent to searcher'});
          },
        function(err)
        {
          reject({msg:'faced some internal error: ',err});
        }

        );
  });

  return promise;
}

module.exports = {
  kickOffDomainIndexing: kickOffDomainIndexing
}
