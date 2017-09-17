var mongoose = require('mongoose');
var logger = require('../utilities/logger.js');
require('../../model/userDetailsmodel.js');
var userModel = mongoose.model('user_details');

module.exports.createUserInfo = function (req, res) {

    if (res.headersSent) {//check if header is already returned
        logger.warn("Response already sent.Hence skipping the function call createUserInfo")
        return;
    }  

    var userSchema = new userModel();

    new Promise(function (resolve, reject) {
  
        userSchema.emailID = req.body["emailID"],
        userSchema.loginPassword = req.body["loginPassword"]
        userSchema.isdCode = parseInt(req.body["isdCode"])
        userSchema.primaryPhonenumber = parseInt(req.body["primaryPhonenumber"])
        userSchema.secondaryPhonenumber = parseInt(req.body["secondaryPhonenumber"])
        userSchema.whatsappPhonenumber = parseInt(req.body["whatsappPhonenumber"])
        
        userSchema.userTitle = req.body["userTitle"]
        userSchema.gender = req.body["gender"]
        userSchema.firstName = req.body["firstName"]
        userSchema.middleName = req.body["middleName"]
        userSchema.nickName = req.body["nickName"]
        userSchema.lastName = req.body["lastName"]
        userSchema.dateofbirth = req.body["dateofbirth"]
        
        userSchema.preferredContacttime = req.body["preferredContacttime"]
        userSchema.preferredContactmethod = req.body["preferredContactmethod"]
        userSchema.emailVerified = req.body["emailVerified"]
        userSchema.userPicdir = req.body["userPicdir"]
        userSchema.userType = req.body["userType"]
        userSchema.agentType = req.body["agentType"]

       userSchema.contactAddress = [{
           addressType: req.body["addressType"],
           addressLine1: req.body["addressLine1"],
           addressLine2: req.body["addressLine2"],
           City: req.body["City"],
           postalCode: req.body["postalCode"],
           residingcountry: req.body["residingcountry"],
           landmark: req.body["landmark"],
        }] 

        userSchema.favourites = [] //this will come from different api

        resolve();
    })
    .then(function () {
            userSchema.save(function (error, data) {
                if (error) {
                    logger.error("Error while inserting record : - " + error.message)
                    return res.status(500).json({ "Message": error.message.split(":")[2].trim() });
                }
                else {
                    return res.json({ "Message": "Data got inserted successfully" });
                }
            })
        })
        .catch(function (err) {
            logger.error("Error while inserting record : - " + err.message)
            return res.status(500).json({ "Message": err.message });
        })
        
};
//update user info
module.exports.updateUserInfo = function (req, res) {

    if (res.headersSent) {//check if header is already returned
        logger.warn("Response already sent.Hence skipping the function call updateUserInfo")
        return;
    }  

    var userEmailId = req.params.emailId;

    if (userEmailId == null) {
        logger.error("Error while updating record : - Email id cannot be null")
        return res.status(500).json({ "Message": "Email id cannot be null" });
    }

    //loop through request parameters and get value
    var query = {};
    for (var key in req.body) {      
            item = req.body[key];
            key = requestToUserModelParamMapping(key)
            query[key] = item;
    }

    userModel.findOneAndUpdate({ "emailID": userEmailId }, { "$set": query }, function (err, doc) {//{ $set: { <field1>: <value1>, ... } }
        if (err) {
            logger.error("Error while updating record : - " + err.message)
            return res.status(500).json({ "Message": err.message });
        }
        res.status(200).json({ "Message": "User details for user " + userEmailId + " have been updated successfully"});
        
    });

}
//function to get db field name corresponding to form field name
function requestToUserModelParamMapping(reqParamKey) {

    switch (reqParamKey.toLowerCase()) {

        case 'emailid': return "emailID";

        case 'loginpassword': return "loginPassword";

        case 'isdcode': return "isdCode";
 
        case 'primaryphonenumber': return "primaryPhonenumber";

        case 'secondaryphonenumber': return "secondaryPhonenumber";
  
        case 'whatsappphonenumber': return "whatsappPhonenumber";
    
        case 'usertitle': return "userTitle";
 
        case 'gender': return "gender";

        case 'firstname': return "firstName";

        case 'middlename': return "middleName";
  
        case 'nickname': return "nickName";
  
        case 'lastname': return "lastName";

        case 'dateofbirth': return "dateofbirth";
  
        case 'preferredcontacttime': return "preferredContacttime";

        case 'preferredcontactmethod': return "preferredContactmethod";

        case 'emailverified': return "emailVerified";

        case 'userpicdir': return "userPicdir"; 

        case 'usertype': return "userType";

        case 'agentType': return "agenttype";

        case 'addressType': return "addresstype";

        case 'addressline1': return "addressLine1";

        case 'addressline2': return "addressLine2";

        case 'city': return "City";

        case 'postalcode': return "postalCode";

        case 'residingcountry': return "residingcountry";

        case 'landmark': return "landmark";

        case 'favourites.hospitalid': return "hospitalid";

        case 'favourites.doctorid': return "doctorid";

        case 'favourites.treatmentId': return "treatmentId";

        default: return reqParamKey;

    }
}
