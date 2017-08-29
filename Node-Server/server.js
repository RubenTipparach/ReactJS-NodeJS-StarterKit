'use strict';
var express = require('express'),
    app     = express(),
    port    = parseInt(process.env.PORT, 10);

var bodyParser = require('body-parser');
// ACTIVATE CORS!
var cors = require('cors');

var server = require('http').Server(app);
var io = require('socket.io')(server);
var colors = require('colors');
var strFormat = require('string-format');
var sql = require('mssql');

var logger = require('./logger.js');
var sqlServer = require('./sqllib/sqlserver.js');
var config = require('./config.json');

logger.level = 'error';

console.log(config.sqlConn);

//var sqlConn = new sqlServer(config.sqlConn);

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors());


server.listen(config.port_number, () => {
    logger.info(`Map started on port ${config.port_number.toString().green.bold}`);
});


app.post('/comms', (req, res) =>
{	
	//console.log(req.raw);
	//console.log(req.body);

	for( var i in req)
	{
	//	console.log(i);
	}

	console.log("--------------");
	console.log(req.body);
	console.log(req.query);

    //res.header("Access-Control-Allow-Origin", "*");
    //res.header("Access-Control-Allow-Headers", "X-Requested-With");

	res.send("blah");
});
