const logger = require('./../../applogger');
const urlIndexing = require('./domainController').urlIndexing;
const config = require('./../../config');
const amqp = require('amqplib');
const highland = require('highland');

const startDomainEngine = function () {
    let amqpConn = amqp.connect(config.RABBITMQ.rabbitmqURL);

    amqpConn
        .then(function (conn) {
            logger.info('[*] Connected to AMQP successfully..!');
            return conn.createChannel();
        })
        .then(function (chConn) {
            logger.info('[*] Established AMQP Channel connection successfully..!');

        });
}

module.exports = {
    startDomainEngine: startDomainEngine
}