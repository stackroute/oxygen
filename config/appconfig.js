const path = require('path');
const extend = require('util')._extend;

function loadEnvVariables() {
  const fs = require('fs');
  const envFile = path.join(__dirname, 'ENV.json');

  let env = {};

  // Read env.json file, if it exists, export the configs & settings from that to the process env variables

  if (fs.existsSync(envFile)) {
    env = fs.readFileSync(envFile, 'utf-8');
    env = JSON.parse(env);
    Object.keys(env).forEach(key => process.env[key] = env[key]);
  }
}

loadEnvVariables();

//  Load environment specific config settings
const development = require('./env/DEV');

const defaults = {
  SERVER_ROOT: path.join(__dirname, '..'),
};

const appConfig = {
  DEV: extend(development, defaults)
};

module.exports = appConfig[(process.env.NODE_ENV || 'DEV')];
