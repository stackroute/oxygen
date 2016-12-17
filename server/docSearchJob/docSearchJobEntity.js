const mongoose = require('mongoose');


/* beautify ignore:start */
/* beautify preserve:start */

const jobSchema = new mongoose.Schema({ 
	query: String,
	engineID:String,
	exactTerms:String,
	results:Number,
	siteSearch:String

}, {collection: 'Job', versionKey: false});


const engineSchema = new mongoose.Schema({ 
	
	engine:[{"type":String,"unique":true}],
	key:[{"type":String,"unique":true}]
	

}, {collection: 'Engines', versionKey: false});

//schema.index({name: 1}, {unique: true});

const docSearchJobModel = mongoose.model('Job', jobSchema);
const engineModel = mongoose.model('Engines', engineSchema);

module.exports = {
	docSearchJobModel: docSearchJobModel,
	engineModel:engineModel

};

/* beautify preserve:end */
/* beautify ignore:end */
