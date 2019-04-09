const path = require('path');

const service = require('./service');

function setupWebAppRESTRoutes(app) {
  app.use('/docsearchjob', require(path.join(__dirname, 'docSearchJob')));
  app.use('/domain', require(path.join(__dirname, 'domains')));
  app.use('/crawl', require(path.join(__dirname, 'docCrawler')));
  app.use('/parse', require(path.join(__dirname, 'docIntentParser')));
  return app;
}

function welcome() {
  let motdFile = path.resolve(__dirname, '.webapp.motd');
  const fs = require('fs');
  if (fs.existsSync(motdFile)) {
    let msg = fs.readFileSync(motdFile, 'utf-8');
    process.stdout.write('\n' + msg + '\n');
  } else {
    process.stdout.write('\n=========== Oxygen WWW ===========\n');
  }
}

// App Constructor function is exported
module.exports = function() {

  welcome();    

  let app = service.createApp();

  app = service.setupWebpack(app);

  app = service.setupStaticRoutes(app);

  app = service.setupMiddlewares(app);

  app = setupWebAppRESTRoutes(app);

  app = service.setupRestRoutes(app);

  service.setupMongooseConnections();

  return app;
};
