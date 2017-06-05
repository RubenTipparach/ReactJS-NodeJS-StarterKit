'use strict';
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var colors = require('colors');
var strFormat = require('string-format');
var sql = require('mssql');

var logger = require('./logger.js');
var sqlServer = require('./SqlServer/sqlserver.js');
var sqlConn = new sqlServer();

var config = require('./main-server-conf.json');

server.listen(config.port_number, () => {
    logger.info(`Map started on port ${config.port_number.toString().green.bold}`);
});
