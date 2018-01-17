﻿var mongoose = require('mongoose');
var config = require('./confutils');
var crypto = require('./crypto');
mongoose.Promise = global.Promise;

/* Connect to Mongo db */
module.exports.getMogoDbCon = function () {
       
    var options = {
        native_parser: true,
        poolSize: 1,
    }
   
    return new Promise((resolve, reject) => {

        if (mongoose.connection.readyState === 0) {
            var mongoUri = getmongouri(); //'mongodb://libin:libin@localhost:27017/medinovita';
            mongoose.connection.openUri(mongoUri, options);
            var db = mongoose.connection;

            db.on('error', function () {
                throw new Error('unable to connect to database');
                reject(null)
            });
        }
    resolve(db); 
       
    });
}; 

module.exports.closeMongoDBConnection1 = function () {
    
    return new Promise((resolve, reject) => {
        mongoose.disconnect();
        resolve(true);

    });
}; 


module.exports.closeMongoDBConnection = function (dbConnect) {

    return new Promise((resolve, reject) => {
        dbConnect.close();
        resolve(true);

    });
}; 
/*  Get the connection string for Mongo db */
function getmongouri() {

    var dbname = config.getProjectSettings('MONGODB', 'DB_NAME',true);
    var uid = config.getProjectSettings('MONGODB', 'DB_USER', true);
    var paswd = config.getProjectSettings('MONGODB', 'DB_PASSWORD', true);
    var dbhost = config.getProjectSettings('MONGODB', 'DB_HOST', true);
    var dbport = config.getProjectSettings('MONGODB', 'DB_PORT', true);
    var ispaswdencrypted = config.getProjectSettings('MONGODB', 'PSWD_ENCRYPTED', true);

    if (ispaswdencrypted.toUpperCase() == 'Y') {       
        paswd = crypto.decrypt(paswd);        
    }

    var mongouri = 'mongodb://' + uid + ':' + paswd + '@' + dbhost + ':' + dbport + '/' + dbname;    
    return mongouri;
}
