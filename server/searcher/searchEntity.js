const mongoose = require('mongoose');

/* beautify ignore:start */
/* beautify preserve:start */
const schema = new mongoose.Schema({
	query: String,
	url: String,
	title: String,
	description: String,
	concept : [{
		word : String,
		density : Number
	}],
	newWords : [{
		word : String,
		density : Number
	}],
	intent:[{
		basic: Number,
		tutorial: Number,
		theory: Number,
		manual:Number,
		completeReference:Number
	}]
}, {collection: 'searcherResult', versionKey: false});

//schema.index({url: 1}, {unique: true});

const model = mongoose.model('searcherResult', schema);

module.exports = {
	searchModel: model
};

/* beautify preserve:end */
/* beautify ignore:end */
