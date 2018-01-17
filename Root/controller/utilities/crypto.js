var crypto, ALGORITHM, KEY, HMAC_ALGORITHM, HMAC_KEY, N_KEY, N_HMAC_KEY;

var config = require('./confutils.js')
var logger = require('../utilities/logger.js');

crypto = require('crypto');

ALGORITHM = config.getProjectSettings('ENCRYPTION', 'ALGORITHAM', false) //"AES-256-CBC"; 
HMAC_ALGORITHM = config.getProjectSettings('ENCRYPTION', 'HMAC_ALGORITHM', false) //"SHA256"; 

if (typeof KEY == 'undefined' && !KEY) {
    //random valuesfor encryption using crypto
    KEY = crypto.randomBytes(32);
    HMAC_KEY = crypto.randomBytes(32); 

    //KEY = Buffer.from('abcdefghijklmnopqrstuvwxyzabcdef', 'binary'); //crypto.randomBytes(32);
    //HMAC_KEY = Buffer.from('abcdefghijklmnopqrstuvwxyzabcdef', 'binary'); //crypto.randomBytes(32);  
}

if (typeof N_KEY == 'undefined' && !N_KEY) {
    N_KEY = Buffer.from(config.getProjectSettings('ENCRYPTION', 'N_KEY', false), 'binary');
    N_HMAC_KEY = Buffer.from(config.getProjectSettings('ENCRYPTION', 'N_HMAC_KEY', false), 'binary'); 
}

module.exports.secureEncrypt = function (plain_text) {    
    var IV = new Buffer(crypto.randomBytes(16)); // ensure that the IV (initialization vector) is random   
    var cipher_text;
    var hmac;
    var encryptor;

    encryptor = crypto.createCipheriv(ALGORITHM, KEY, IV);
    encryptor.setEncoding('hex');
    encryptor.write(plain_text);
    encryptor.end();

    cipher_text = encryptor.read();

    hmac = crypto.createHmac(HMAC_ALGORITHM, HMAC_KEY);
    hmac.update(cipher_text);
    hmac.update(IV.toString('hex')); // ensure that both the IV and the cipher-text is protected by the HMAC

    // The IV isn't a secret so it can be stored along side everything else
    return cipher_text + "$" + IV.toString('hex') + "$" + hmac.digest('hex')

};

module.exports.secureDecrypt = function (cipher_text) {
    var cipher_blob = cipher_text.split("$");
    var ct = cipher_blob[0];
    var IV = new Buffer(cipher_blob[1], 'hex');
    var hmac = cipher_blob[2];
    var decryptor;

    chmac = crypto.createHmac(HMAC_ALGORITHM, HMAC_KEY);
    chmac.update(ct);
    chmac.update(IV.toString('hex'));

    if (!constant_time_compare(chmac.digest('hex'), hmac)) {
        logger.error("Encrypted Blob has been tampered with...");
        return "Encrypted Blob has been tampered with...";
    }

    decryptor = crypto.createDecipheriv(ALGORITHM, KEY, IV);
    var decryptedText = decryptor.update(ct, 'hex', 'utf8');
    return decryptedText + decryptor.final('utf-8')


};

module.exports.encrypt = function (plain_text) {

    var IV = new Buffer(crypto.randomBytes(16)); // ensure that the IV (initialization vector) is random   
    var cipher_text;
    var hmac;
    var encryptor;

    encryptor = crypto.createCipheriv(ALGORITHM, N_KEY, IV);
    encryptor.setEncoding('hex');
    encryptor.write(plain_text);
    encryptor.end();

    cipher_text = encryptor.read();

    hmac = crypto.createHmac(HMAC_ALGORITHM, N_HMAC_KEY);
    hmac.update(cipher_text);
    hmac.update(IV.toString('hex')); // ensure that both the IV and the cipher-text is protected by the HMAC

    // The IV isn't a secret so it can be stored along side everything else
    return cipher_text + "$" + IV.toString('hex') + "$" + hmac.digest('hex')

}

module.exports.decrypt = function (cipher_text) {
    var cipher_blob = cipher_text.split("$");
    var ct = cipher_blob[0];
    var IV = new Buffer(cipher_blob[1], 'hex');
    var hmac = cipher_blob[2];
    var decryptor;

    chmac = crypto.createHmac(HMAC_ALGORITHM, N_HMAC_KEY);
    chmac.update(ct);
    chmac.update(IV.toString('hex'));

    if (!constant_time_compare(chmac.digest('hex'), hmac)) {
        logger.error("Encrypted Blob has been tampered with...");
        return "Encrypted Blob has been tampered with...";
    }

    decryptor = crypto.createDecipheriv(ALGORITHM, N_KEY, IV);
    var decryptedText = decryptor.update(ct, 'hex', 'utf8');
    return decryptedText + decryptor.final('utf-8')
};

var constant_time_compare = function (val1, val2) {
    var sentinel;

    if (val1.length !== val2.length) {
        return false;
    }


    for (var i = 0; i <= (val1.length - 1); i++) {
        sentinel |= val1.charCodeAt(i) ^ val2.charCodeAt(i);
    }

    return sentinel === 0
};

//use api to get the encryption n decryption
//http://localhost:1337/api/v1/getsecureencryptedText/libin


