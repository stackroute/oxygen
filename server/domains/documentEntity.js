const mongoose = require('mongoose');

/* beautify ignore:start */
/* beautify preserve:start */
const schema = new mongoose.Schema({
	domain: String,
  docUrl:String,
	intentRating:[
		{intent:String,rating: Number},
		{intent:String,rating: Number},
		{intent:String,rating: Number},
		{intent:String,rating: Number},
		{intent:String,rating: Number}
	]
}, {collection: 'domain', versionKey: false});

//schema.index({url: 1}, {unique: true});

const model = mongoose.model('domain', schema);

module.exports = {
	domain: model
};

/* beautify preserve:end */
/* beautify ignore:end */
