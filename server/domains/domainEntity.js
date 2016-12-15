const mongoose = require('mongoose');

/* beautify ignore:start */
/* beautify preserve:start */
const schema = new mongoose.Schema({
	domain: String,
	description: String,
	user: String,
	creationDate: String,
  concepts:Number,
  image:String,
	intents:[
    {intent:String,docs: Number},
    {intent:String,docs: Number},
    {intent:String,docs: Number},
    {intent:String,docs: Number},
    {intent:String,docs: Number}
	 ]
}, {collection: 'domain', versionKey: false});

//schema.index({url: 1}, {unique: true});

const model = mongoose.model('domain', schema);

module.exports = {
	domain: model
};

/* beautify preserve:end */
/* beautify ignore:end */
