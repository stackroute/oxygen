'use strict';

const logger = require('./../../applogger');
const docSearchJobModel = require('./docSearchJobEntity').docSearchJobModel;
const open=function(objId){
 amqp.connect('amqp://localhost', function(connErr, conn) {
   conn.createChannel(function(channelErrs, ch) {
     ch.assertQueue('hello', {durable: false});
     ch.sendToQueue('hello', new Buffer(objId));
     return ch;
   });
    //setTimeout(function() w{ conn.close(); process.exit(0) }, 500);
  });};
const addDomainJob = function(jobData, callback) {
  console.log(jobData)
  let job=new docSearchJobModel(jobData);
  job.save(function(err) {
    if (err) {
      logger.error(
        "Encountered error at doSearchJobController::addJob, error: ",
        err);
      return callback(err, {});
    }
    return callback(null, job);
  });
};

const addDomain = function(jobData, callback) {
  console.log(jobData)
  let job=new docSearchJobModel(jobData);
  job.save(function(err) {
    if (err) {
      logger.error(
        "Encountered error at doSearchJobController::addJob, error: ",
        err);
      return callback(err, {});
    }
    return callback(null, job);
  });
};

const showJob = function(callback) {

  docSearchJobModel.find(function(err, jobs) {
    if (err) {
      logger.error(
        "Encountered error at doSearchJobController::showJob, error: ",
        err);
      return callback(err, {});
    }
    console.log(jobs);
    return callback(null, jobs);
  });
};

module.exports = {
  addJob: addJob,
  showJob:showJob,
  deleteJob:deleteJob,
  updateJob:updateJob
};
