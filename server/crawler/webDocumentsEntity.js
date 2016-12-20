const mongoose = require('mongoose');

/* beautify ignore:start */
/* beautify preserve:start */

const contentSchema = new mongoose.Schema({
	word:{type:String},
	intensity:{type:String}
},{ _id : false });


const schema = new mongoose.Schema({
	domain: { type: String, required: true },
	concept: { type: String , required: true },
	url: { type: String, required: true,unique: true },
	interestedTerms : [{type:String}],
	terms : [contentSchema],
	otherWords : [contentSchema]
}, {collection: 'WebDocuments', versionKey: false});

const model = mongoose.model('WebDocuments', schema);

module.exports = {
	webDocumentsModel: model
};