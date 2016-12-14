const keyword_extractor = require("keyword-extractor");
require('events').EventEmitter.defaultMaxListeners = Infinity;
const extractData=function(text){
  //filtering out the unwanted data from fetched data like stop words using library

  let txt = keyword_extractor.extract(text,
  {
    language:"english",
    remove_digits: true,
    return_changed_case:true,
    remove_duplicates: false
  })
  console.log("in extract data")
  return txt;
}

const termDensity=function(text){
  let corpus = [];
  text.forEach(function (word) {
  // We don't want to include very short or long words because they're probably bad data.
  if (word.length > 20) {
   return;
 }

 if (corpus[word]) {
   // If this word is already in our corpus,
   //our collection of terms, increase the count for appearances of that word by one.
   corpus[word]+=1;
 } else {
   // Otherwise, say that we've found one of that word so far.
   corpus[word] = 1;
 }
})
  console.log("in term density")
  return corpus;
}

const interestedWords=function(corpus){
  let intent = [];
  let otherWords = [];
  let interestwords=['react','tutorial','waste'];
  for (let prop in corpus) {

    if(interestwords.includes(prop))
    {
      intent.push({
        word:prop,
        density:corpus[prop]
      });
    }
    else
    {
      otherWords.push({
        otherWords:prop,
        density:corpus[prop]
      });
    }
  }
  console.log("returning the final result")
  return { "concepts": intent, "otherterms": otherWords };

}

module.exports = {
 interestedWords:interestedWords,
 termDensity:termDensity,
 extractData:extractData
};
