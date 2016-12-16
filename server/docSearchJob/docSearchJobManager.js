// let jobCtrl = require('./jobController');

// let kickOffDomainIndexing = function(domainName, conceptsColln) {
//   // Kick off search jobs for each concept
//   let promise = new Promise(function(resolve, reject) {

//     //Looping through for each given concept, as each concept should be one job
//     conceptsColln.forEach(function(concept) {
//       process.nextTick(jobCtrl.addSearchJob(domainName, concept));
//     });

//     resolve(domainName);
//   });

//   return promise;
// }

// module.exports = {
//   kickOffDomainIndexing: kickOffDomainIndexing
// }
