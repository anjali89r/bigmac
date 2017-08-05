//import golbal modules
var userInfo = require('../controller/api/userDetailsController.js');
var hospitalInfo = require('../controller/api/hospitalDoctorDetailsController.js');
var tripInfo = require('../controller/api/tripMasterController.js');
var security = require('../controller/api/security.js');

module.exports = function (app) {

    //************************API to operate on user_details Schema**********************************
    app.put('/api/v1/insertNewUser', userInfo.insertNewUser);    
    //***********************************************************************************************

    //************************API to operate on hospital schema**************************************
    app.get('/api/v1/insertHospitalRecord', hospitalInfo.insertTreatmentDetails)
    //***********************************************************************************************

    //************************API to operate on trip schema******************************************
    app.get('/api/v1/insertTripinfo', tripInfo.inserttripDetails)    
    //***********************************************************************************************




    //encrypt and decrypt api
    app.get('/api/v1/getsecureencryptedText/:txt', security.secureEncryptedText);//sample call http://localhost:1337/api/v1/getsecureencryptedText/libin
    app.get('/api/v1/getsecuredecryptedText/:txt', security.secureDecryptedText);//this is more secure as the encryption mechanism chnages on every server restart
    app.get('/api/v1/getnonsecureencryptedText/:txt', security.nonsecureEncryptedText);
    app.get('/api/v1/getnonsecuredecryptedText/:txt', security.nonsecuredecryptedText);

    //web token example
    app.get('/api/v1/protected/token/:apiname', security.generateJWTToken);//api to generate jwt toke
    //api call with header and web tokenn jjjkj
    //app.get('/api/v1/protected/getUserinfo/:apiname', security.verifyBasicAuth,security.verifyJWTToken, userInfo.getAllUserDetails);//http://localhost:1337/api/v1/protected/getUserinfo/getuser & in header x-access-token = 'webtaoken gnerated using previous api call & basic authentication credentials from config.json
   
}

