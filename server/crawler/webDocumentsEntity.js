const mongoose = require('mongoose');

const DOMAIN_STATUS = ['new', 'error', 'ready'];

/* beautify ignore:start */
/* beautify preserve:start */
const schema = new mongoose.Schema({
	domain: { type: String, required: true, unique: true },
	concept: { type: String },
	url: { type: String },
	intrestedTerms : {type: String},
   concept : {type :String},
   otherWords : {type: String}
}, {collection: 'webDocuments', versionKey: false});

const model = mongoose.model('webDocuments', schema);

module.exports = {
	webDocumentsModel: model
};