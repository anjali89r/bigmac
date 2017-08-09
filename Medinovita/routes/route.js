//import golbal modules
var userInfo = require('../controller/api/userDetailsController.js');
var hospitalInfo = require('../controller/api/hospitalDoctorDetailsController.js');
var tripInfo = require('../controller/api/tripMasterController.js');
var security = require('../controller/api/security.js');

module.exports = function (app) {

    //************************Generate JWT web Token************************************************
    app.get('/api/v1/protected/token/:apiTokenName', security.generateJWTToken);
    //**********************************************************************************************

    //************************API to operate on user_details Schema**********************************
    //apiTokenName for userInfo is postuser.API to generate token :/api/v1/protected/token/postuser.make sure jwt in config json is updated with postuser
    //Header should contain basic authentication with credentials from config json and x-access-token = 'webtaoken gnerated using api call'
    app.post('/api/v1/add/userInfo/:apiTokenName', security.verifyBasicAuth, security.verifyJWTToken, userInfo.createUserInfo); //api to insert a new user record in to db
    app.put('/api/v1/update/userInfo/:emailId/:apiTokenName', security.verifyBasicAuth, security.verifyJWTToken, userInfo.updateUserInfo);
    //***********************************************************************************************
     
    //************************API to operate on hospital schema**************************************
    app.post('/api/v1/add/hospitalrecord/:apiTokenName', security.verifyBasicAuth, security.verifyJWTToken, hospitalInfo.createHospitalRecord)//Insert a new record
    app.post('/api/v1/update/hospitalrecord/:hospitalname/:hospitalcity/hospitalcountry/:apiTokenName', security.verifyBasicAuth, security.verifyJWTToken, hospitalInfo.createHospitalRecord)//update hospital record
    //***********************************************************************************************

    //************************API to operate on trip schema******************************************
    app.get('/api/v1/insertTripinfo', tripInfo.inserttripDetails)    
    //***********************************************************************************************

    app.put('/api/v1/insertTripinfo', tripInfo.inserttripDetails)//temp


    //encrypt and decrypt api
    app.get('/api/v1/getsecureencryptedText/:txt', security.secureEncryptedText);//sample call http://localhost:1337/api/v1/getsecureencryptedText/libin
    app.get('/api/v1/getsecuredecryptedText/:txt', security.secureDecryptedText);//this is more secure as the encryption mechanism chnages on every server restart
    app.get('/api/v1/getnonsecureencryptedText/:txt', security.nonsecureEncryptedText);
    app.get('/api/v1/getnonsecuredecryptedText/:txt', security.nonsecuredecryptedText);

   
    
}

