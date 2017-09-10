var logger = require('../utilities/logger.js');
var crypto = require('../utilities/crypto.js');
var config = require('../utilities/confutils.js')
var jwt = require('jsonwebtoken');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

module.exports.secureEncryptedText = function (req, res) {

    var id = req.params.txt;
    if (typeof id == 'undefined' && !id) {
        logger.error('invalid query paramter in getencryptedText method')
        return res.status(400).send('invalid query paramter');
    }
    logger.info("string to encrypt ==>" + id)
    var encrypted = crypto.secureEncrypt(id);
    logger.debug("encrypted text ==>" + encrypted);

    return res.send(encrypted);
    
};

module.exports.secureDecryptedText = function (req, res) {

    var id = req.params.txt;
    if (typeof id == 'undefined' && !id) {
        logger.error("query paramter is - " + id);
        logger.error('invalid query paramter in secureDecryptedText method')
        return res.status(400).send('invalid query paramter');
    }

    logger.info("string to decrypt ==>" + id)
    var decrypted = crypto.secureDecrypt(id);
    logger.debug("decrypted text ==>" + id);
    return res.send(decrypted)

};

module.exports.nonsecureEncryptedText = function (req, res) {

    var id = req.params.txt;
    if (typeof id == 'undefined' && !id) {
        logger.error('invalid query paramter in getencryptedText method')
        return res.status(400).send('invalid query paramter');
    }
    logger.info("string to encrypt ==>" + id)
    var encrypted = crypto.encrypt(id);
    logger.debug("encrypted text ==>" + encrypted);

    return res.send(encrypted);
}

module.exports.nonsecuredecryptedText = function (req, res) {

    var id = req.params.txt;
    if (typeof id == 'undefined' && !id) {
        logger.error("query paramter is - " + id);
        logger.error('invalid query paramter in getencryptedText method')
        return res.status(400).send('invalid query paramter');
    }
    logger.info("string to encrypt ==>" + id)
    var encrypted = crypto.decrypt(id);
    logger.debug("encrypted text ==>" + encrypted);

    return res.send(encrypted);
}

module.exports.generateJWTToken = function (req, res) {

    //write the code to authnticate user using user id here and over ride the below field for user specific token.const user = { id: 3 };
    var api = req.params.apiTokenName;
    var payload = { api: config.getProjectSettings('JWT', 'API_' + api.toUpperCase() + '_PAYLOAD', false) }; //jwt.sign(payload, secretOrPrivateKey, [options, callback])
    var secretkey = config.getProjectSettings('JWT', 'API_' + api.toUpperCase() + '_SECRETKEY', false);

    var token = jwt.sign({ payload: payload.api }, secretkey);

    res.send(token);
    
}

module.exports.verifyJWTToken = function (req, res, next) {//generic function to verify jwt web token

    if (res.headersSent) {//check if header is already returned
        logger.warn("Response already sent.Hence skipping the function call verifyJWTToken")
        return;
    } 
    
    var bearerHeader = req.headers['x-access-token'];
    var api = req.params.apiTokenName;
    var token;
    req.authenticated = false;
    if (bearerHeader) {
        token = bearerHeader;
        jwt.verify(token, config.getProjectSettings('JWT', 'API_' + api.toUpperCase() + '_SECRETKEY', false), function (err, decoded) {
            if (err) {                
                req.authenticated = false;
                req.decoded = null;
                next();
                logger.error("invalid api token - " + token);
                res.status(500).json({ "Message": "Invalid API token" });
            } else {
                req.authenticated = true;
                next();
            }
        });
    } else {
        logger.error("No API token in the code");
        req.authenticated = false;
        res.status(500).json({ "Message": "No API token in the request" });
        next();
    }
}

module.exports.verifyBasicAuth = function (req, res, next) {//generic function to verify jwt web token
    if (!req.headers.authorization) {
        logger.error("Basic authetication failed as credentials not supplied");
        res.status(500).json({ "Message": "No authorization in the request" });
        req.authenticated = false;
        next()
    } else {

        var api = req.params.apiTokenName;

        var apiexpuser = config.getProjectSettings('JWT', 'API_' + api.toUpperCase() + '_BAICAUTH_USERNAME', false)
        var apiexpswd = config.getProjectSettings('JWT', 'API_' + api.toUpperCase() + '_BAICAUTH_PASSWORD', false)
       
        var header = req.headers['authorization'] || '';        // get the header
        token = header.split(/\s+/).pop() || '';            // and the encoded auth token
        auth = new Buffer(token, 'base64').toString();    // convert from base64
        parts = auth.split(/:/);                          // split on colon
        username = parts[0],
        password = parts[1];
      
        if (username != apiexpuser || apiexpswd != password) {
            logger.error("Basic authetication failed as credentials do not match");
            logger.error("Actual user name - " + username);
            logger.error("Actual password - " + password);
            logger.error("Expected user name - " + apiexpuser);
            logger.error("Expected password - " + apiexpswd);
            res.status(500).json({ "Message": "Authentication failed" });
            next();
        } else {
            next();
        }
        
    }
}



