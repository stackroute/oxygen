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
const addJob = function(jobData, callback) {
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

const deleteJob = function(jobID, callback) {
  docSearchJobModel.remove( jobID, function(err) {
    if (err) {
      logger.error(
        "Encountered error at doSearchJobController::deleteJob, error: ",
        err);
      return callback(err, {});
    }
    console.log(jobID);
    return callback(null, {msg:'deleted'});
  });
};
const updateJob = function(job, callback) {
  console.log(job)
  docSearchJobModel.findById( job._id, function(err,data) {
    if (err) {
      logger.error(
        "Encountered error at doSearchJobController::updateJob, error: ",
        err);
      return callback(err, {});
    }
    console.log(data);
    data.query=job.query
    data.engineID=job.engineID
    data.exactTerms=job.exactTerms
    data.results=job.results
    data.siteSearch=job.siteSearch

    let ack=data.save(function (save_err){
      if(!save_err)
      {
        return callback(null, {msg:'updated'});
      }
      return callback(null,{err:"unexpected"});
    })
    return ack;
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
