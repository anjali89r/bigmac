var winston = require('winston');
var config = require('./confutils');
var fs = require('fs');

var logDir = config.getProjectSettings('LOG', 'LOGDIR', false); 
var consloglevel = config.getProjectSettings('LOG', 'CONSOLE_LOG_LEVEL', false);
var fileloglevel = config.getProjectSettings('LOG', 'FILE_LOG_LEVEL', false);

env = process.env.NODE_ENV;//read environment variable

winston.setLevels(winston.config.npm.levels);
winston.addColors(winston.config.npm.colors);

if (!fs.existsSync(logDir)) { // Create the directory if it does not exist
    fs.mkdirSync(logDir);
}

//{ error: 0, warn: 1, info: 2, verbose: 3, debug: 4, silly: 5 } default log levels.5 being the lowest
var consoleSilent = false;
var fileSilent = true;
if (env == 'PROD') {
    consoleSilent = true;
    fileSilent = false;
}


var logger = new (winston.Logger)({

    transports: [ 

        new winston.transports.Console({
            level: consloglevel, // Only write logs of info level or higher
            colorize: true,           
            silent: consoleSilent
            
        }),
        new winston.transports.File({
            level: env === 'PROD' ? fileloglevel : 'debug',
            filename: logDir + '/logs.log',
            maxsize: 1024 * 1024 * 10,// 10MB
            silent: fileSilent
        })
    ],
    exceptionHandlers: [
        new winston.transports.File({
            filename: logDir + '/exceptions.log'
        })
    ]
});


module.exports = logger;


