const express = require('express');
const path = require('path');
const morgan = require('morgan');
const mongoose = require('mongoose');

const config = require('../config/');
const logger = require('../applogger');

const service = require('./service');

function setupWebAppRESTRoutes(app) {
	app.use('/docsearchjob', require(path.join(__dirname, 'docSearchJob')));

	return app;
}

// App Constructor function is exported
module.exports = function() {
	let app = service.createApp();

	app = service.setupStaticRoutes(app);	

	app = service.setupMiddlewares(app);

	app = service.setupWebpack(app);

	app = setupWebAppRESTRoutes(app);

	app = service.setupRestRoutes(app);

	service.setupMongooseConnections();

	return app;
};
