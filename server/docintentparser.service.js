const logger = require('../applogger');
const intentParserEngine = require('./intentParser/docIntentParserEngine');
const config = require('../config');

const mongoose = require('mongoose');

const path = require('path');

function setupMongooseConnections() {
  mongoose.connect(config.MONGO.mongoURL);

  mongoose.connection.on('connected', function() {
    logger.debug('Mongoose is now connected to ', config.MONGO.mongoURL);
  });

  mongoose.connection.on('error', function(err) {
    logger.error('Error in Mongoose connection: ', err);
  });

  mongoose.connection.on('disconnected', function() {
    logger.debug('Mongoose is now disconnected..!');
  });

  process.on('SIGINT', function() {
    mongoose.connection.close(function() {
      logger.info(
        'Mongoose disconnected on process termination'
      );
      process.exit(0);
    });
  });
}

function welcome() {
  let motdFile = path.resolve(__dirname, '.intent.motd');
  const fs = require('fs');
  if (fs.existsSync(motdFile)) {
    let msg = fs.readFileSync(motdFile, 'utf-8');
    process.stdout.write('\n' + msg + '\n');
  } else {
    process.stdout.write('\n=========== Oxygen Parser ===========\n');
  }
}

let startIntentParserEngine = function() {
  try {
    welcome();

    //Any pre-requisites for running the engine
    setupMongooseConnections();

    logger.info("Starting doc intentParser engine..!");

    intentParserEngine.startIntentParser();
  } catch (err) {
    logger.error("Caught error in running doc intentParser engine: ", err);
  }
}

startIntentParserEngine();
