//import golbal modules
var userInfo = require('../controller/api/userDetailsController.js');
var hospitalInfo = require('../controller/api/hospitalDoctorDetailsController.js');
var tripInfo = require('../controller/api/tripMasterController.js');
var security = require('../controller/api/security.js');
var hospitaltreatmentInfo = require('../controller/api/hospitaltreatmentSearchController.js');
var enquiryInfo = require('../controller/api/userEnquiryController.js');
var medicalSection = require('../controller/api/medicalSectionController.js');
var officeLocationInfo = require('../controller/api/officeLocationController.js');


module.exports = function (app) {

    /************************Generate JWT web Token************************************************/
    app.get('/api/v1/protected/token/:apiTokenName', security.generateJWTToken);
    /**********************************************************************************************/

    /************************API to operate on user_details Schema**********************************/
    /* apiTokenName for userInfo is postuser.API to generate token :/api/v1/protected/token/postuser.make sure jwt in config json is updated with postuser */
    /* Header should contain basic authentication with credentials from config json and x-access-token = 'webtaoken gnerated using api call */
    app.post('/api/v1/add/userInfo/:apiTokenName', security.verifyBasicAuth, security.verifyJWTToken, userInfo.createUserInfo); //api to insert a new user record in to db
    app.put('/api/v1/update/userInfo/:emailId/:apiTokenName', security.verifyBasicAuth, security.verifyJWTToken, userInfo.updateUserInfo);
    app.get('/api/v1/getTreamentlist/:treatmentName/:apiTokenName', security.verifyBasicAuth, security.verifyJWTToken, hospitaltreatmentInfo.getTreatmentlist);
    app.get('/api/v1/searchHospitaldetails/:treatmentName/:country/:apiTokenName', security.verifyBasicAuth, security.verifyJWTToken, hospitaltreatmentInfo.gethospitalDetailbytreatment);
    /***************************************************************************************************************************************************/

    /************************API to operate on medical section schema*******************************************************************************************/
    app.get('/api/v1/getFeaturedtreatments/:apiTokenName', security.verifyBasicAuth, security.verifyJWTToken, medicalSection.getFeaturedtreatments);

    app.get('/api/v1/getaboutMedical/:apiTokenName', security.verifyBasicAuth, security.verifyJWTToken, medicalSection.getaboutMedicalsection);

    app.get('/api/v1/gethighlighttreatments/:limitcount/:skipcount/:apiTokenName', security.verifyBasicAuth, security.verifyJWTToken, medicalSection.gethighlightsection);

    app.post('/api/v1/addFeaturedtreatments/:apiTokenName', security.verifyBasicAuth, security.verifyJWTToken, medicalSection.addFeaturedtreatments);
    /****************************************************************************************************************************************************/


    /************************API to operate on hospital schema*******************************************************************************************/
    /*A PI to insert a new hospital record to database */
    app.post('/api/v1/add/hospitalrecord/:apiTokenName', security.verifyBasicAuth, security.verifyJWTToken, hospitalInfo.createHospitalRecord);//Insert a new record
    /* API to update basic hospital information */
    app.put('/api/v1/update/basicHospitalDetails/:hospitalname/:hospitalcity/:hospitalcountry/:apiTokenName', security.verifyBasicAuth, security.verifyJWTToken, hospitalInfo.updateHospitalNameNContactDetails);
    /* API to add new procedure offered by hospital in an existing hospital collection */
    app.post('/api/v1/add/newtreatment/:hospitalname/:hospitalcity/:hospitalcountry/:apiTokenName', security.verifyBasicAuth, security.verifyJWTToken, hospitalInfo.addProcedureDetails);
    /* API to add details of the doctors offering a particular procedure to hospital collection */
    app.post('/api/v1/add/doctorsofferingtreatment/:hospitalname/:hospitalcity/:hospitalcountry/:procedurename/:apiTokenName', security.verifyBasicAuth, security.verifyJWTToken, hospitalInfo.addDoctorDetails);
    /*******************************************************************************************************************************************************/

    /************************API operate on user enquiry schema*********************************************************************************************/
    /*  APi to submit user enquiry  */
    app.post('/api/v1/submit/enquiry/:apiTokenName', security.verifyBasicAuth, security.verifyJWTToken, enquiryInfo.submitUserEnquiry);
     /*  APi to return response for user enquiry  */
    app.post('/api/v1/submit/response/:userEmail/:enquiryID/:apiTokenName', security.verifyBasicAuth, security.verifyJWTToken, enquiryInfo.sendEnquiryResponse  );
     /*  APi to get list of enquiries where response is due  */
    app.get('/api/v1/get/enquiry/dueresponse/:apiTokenName', security.verifyBasicAuth, security.verifyJWTToken, enquiryInfo.getPendingEnquiryResponse);

    /*********************************************************************************************************************************************************/   
    /************************API operate on office address schema********************************************************************************************/
    /*  APi to get list of office locations  */
    app.get('/api/v1/get/officelocations/:apiTokenName', security.verifyBasicAuth, security.verifyJWTToken, officeLocationInfo.getOfficeLocations);
    /*  APi to post new office location  */
    app.post('/api/v1/post/officelocations/:apiTokenName', security.verifyBasicAuth, security.verifyJWTToken, officeLocationInfo.addOfficeLocations);
    /********************************************************************************************************************************************************/

    //************************API to operate on trip schema******************************************
    app.get('/api/v1/insertTripinfo', tripInfo.inserttripDetails);
    //***********************************************************************************************
  //  app.get('/api/v1/insertHospitalRecord', hospitalInfo.createHospitalRecord)
    //***********************************************************************************************

    //************************API to operate on trip schema******************************************
    //app.get('/api/v1/insertTripinfo', tripInfo.inserttripDetails)    
    //***********************************************************************************************

    //app.put('/api/v1/insertTripinfo', tripInfo.inserttripDetails)//temp


    //encrypt and decrypt api
    app.get('/api/v1/getsecureencryptedText/:txt', security.secureEncryptedText);//sample call http://localhost:1337/api/v1/getsecureencryptedText/libin
    app.get('/api/v1/getsecuredecryptedText/:txt', security.secureDecryptedText);//this is more secure as the encryption mechanism chnages on every server restart
    app.get('/api/v1/getnonsecureencryptedText/:txt', security.nonsecureEncryptedText);
    app.get('/api/v1/getnonsecuredecryptedText/:txt', security.nonsecuredecryptedText);

  };

