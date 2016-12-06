const mongoose = require('mongoose');

/* beautify ignore:start */
/* beautify preserve:start */
const schema = new mongoose.Schema({
	query:String,
	url:String,
	title: String,
	description:String}, {collection: 'searcherResult', versionKey: false});

//schema.index({url: 1}, {unique: true});

const model = mongoose.model('searcherResult', schema);

module.exports = {
	searchModel: model
};

/* beautify preserve:end */
/* beautify ignore:end */
