const mongoose = require('mongoose');

const DOMAIN_STATUS = ['new', 'error', 'ready'];

/* beautify ignore:start */
/* beautify preserve:start */
const schema = new mongoose.Schema({
	name: { type: String, required: true, unique: true },
	description: { type: String },
	domainImgURL: { type: String },
	createdBy: { type: String, default: 'admin' },
	createdOn: { type: Date, default: Date.now },
	updatedOn: { type: Date, default: Date.now },
	status: { type: String, enum: DOMAIN_STATUS, default: 'new', required: true},
	statusText: { type: String}
}, {collection: 'domains', versionKey: false});

const model = mongoose.model('domains', schema);

module.exports = {
	DomainModel: model
};
/* beautify preserve:end */
/* beautify ignore:end */
