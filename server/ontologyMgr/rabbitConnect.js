const amqp = require('amqplib/callback_api');
const config = require('./../../config');
const logger = require('./../../applogger');
let ch =require('./rabbitConnectCheck');
var q = 'hello';
var msg = 'Hello World!';
console.log("ch:"+ch);
ch.assertQueue(q, {durable: false});
// Note: on Node 6 Buffer.from(msg) should be used
ch.sendToQueue(q, new Buffer(msg));
console.log(" [x] Sent %s", msg);
