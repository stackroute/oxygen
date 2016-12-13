
const path = require('path');

const service = require('./service');

function setupWebAppRESTRoutes(app) {
	app.use('/docdomain', require(path.join(__dirname, 'domains')));

	return app;
}

// App Constructor function is exported
module.exports = function() {
	let app = service.createApp();

	app = service.setupWebpack(app);

	app = service.setupStaticRoutes(app);

	app = service.setupMiddlewares(app);

	app = service.setupWebpack(app);

	app = setupWebAppRESTRoutes(app);

	app = service.setupRestRoutes(app);

	service.setupMongooseConnections();

	return app;
};
