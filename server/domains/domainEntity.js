const mongoose = require('mongoose');

/* beautify ignore:start */
/* beautify preserve:start */
const schema = new mongoose.Schema({
	name: { type: String, required: true, unique: true },
	description: { type: String },
	domainImgURL: { type: String },
	createdBy: { type: String, default: 'admin' },
	createdOn: { type: Date, default: Date.now }
}, {collection: 'domains', versionKey: false});

const model = mongoose.model('domains', schema);

module.exports = {
	DomainModel: model
};
/* beautify preserve:end */
/* beautify ignore:end */
