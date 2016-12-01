'use strict';

let log4js = require('log4js');
let path = require('path');

log4js.configure(path.join(__dirname, './log4js.conf.json'), {
  cwd: path.join(__dirname, 'logs')
});

let logger = log4js.getLogger();

module.exports = logger;
