var mongoose = require('mongoose');
var config = require('./confutils');
var crypto = require('./crypto');
mongoose.Promise = global.Promise;

module.exports.getMogoDbCon = function () {
    
    var mongoUri = getmongouri(); //'mongodb://libin:libin@localhost:27017/medinovita';

    mongoose.connection.openUri(mongoUri);
    var db = mongoose.connection;

    db.on('error', function () {
        throw new Error('unable to connect to database');
    });    
    return db;
};

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

