﻿var express = require('express');
var bodyParser = require('body-parser')

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.disable('x-powered-by')
var mogoDBUtils = require('./controller/utilities/mongodbutils.js')
var logger = require('./controller/utilities/logger.js'); //initialize logger class

require('./routes/route.js')(app);//define express router for api calls
mogoDBUtils.getMogoDbCon();//open dbconnection

//setup server
var port = process.env.PORT || 1337  //port

app.use(express.static('./views/webcontent/', { index: 'index.html' }))//define home page

app.listen(port);
console.log('Listening on port ' + port + '..');