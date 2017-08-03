var config = require('config-json');
var logger = require('winston'); 
config.setBaseDir('./settings')
config.load('config.json');

var Env = config.get('SANDBOX', 'Env');//read the current environment
process.env.NODE_ENV = Env;

function getConfigValue(configKey, subConfigKey, isblnEnvattr, callback) {

    return callback(configKey, subConfigKey, isblnEnvattr);

}

function readConfigJson(configKey, subConfigKey, isblnEnvattr) {

    if (Boolean(isblnEnvattr) === true) { //eg MONGODB_DEV
        configKey = configKey + "_" + Env;
    }

    var output = "Config key does not exists";

    try {
        output = config.get(configKey , subConfigKey);
    } catch (err) {
        output = "Config key does not exists";
    } finally { 
        return output;
    }
}

module.exports.getProjectSettings = function (configKey, subConfigKey, isblnEnvattr) {
    return getConfigValue(configKey, subConfigKey, isblnEnvattr, readConfigJson)
}