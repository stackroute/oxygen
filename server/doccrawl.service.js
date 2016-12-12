
const path = require('path');
const service = require('./service');

function setupWebAppRESTRoutes(app) {
	app.use('/crawler', require(path.join(__dirname, 'crawler')));

	return app;
}
// App Constructor function is exported
module.exports = function() {
	let app = service.createApp();

	app = service.setupMiddlewares(app);

	app = setupWebAppRESTRoutes(app);

	app = service.setupRestRoutes(app);

	service.setupMongooseConnections();

	return app;
};
