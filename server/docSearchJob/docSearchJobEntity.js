const mongoose = require('mongoose');

/* beautify ignore:start */
/* beautify preserve:start */
const schema = new mongoose.Schema({ 
	query: String,
	engineID:String,
	extraTerms:String,
	results:Number,
	siteSearch:String

}, {collection: 'Job', versionKey: false});

//schema.index({name: 1}, {unique: true});

const model = mongoose.model('Job', schema);

module.exports = {
	docSearchJobModel: model
};

/* beautify preserve:end */
/* beautify ignore:end */
