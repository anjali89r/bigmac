var mongoose = require('mongoose');
var Promise = require('promise');
var logger = require('../utilities/logger.js');
require('../../model/userDetailsmodel.js');
var userModel = mongoose.model('user_details');

module.exports.createUserInfo = function (req, res) {

    var userSchema = new userModel();

    new Promise(function (resolve, reject) {
  
        userSchema.emailID = "nit.libin@gmail.com",
        userSchema.loginPassword = "admin"
        userSchema.isdCode = 91
        userSchema.primaryPhonenumber = 9740177277
        userSchema.secondaryPhonenumber = 9740177277
        userSchema.whatsappPhonenumber = 9740177277
        
        userSchema.userTitle = "Mr."
        userSchema.gender = "Male"
        userSchema.firstName = "Libin"
        userSchema.middleName = ''
        userSchema.nickName = ''
        userSchema.lastName = "Sebastian"
        userSchema.dateofbirth = "18/03/1985"
        
        userSchema.preferredContacttime = "Morning"
        userSchema.preferredContactmethod = "email"
        userSchema.emailVerified = "Y"
        userSchema.userPicdir = ''
        userSchema.userType = "Patient"
        userSchema.agentType = "Individual"

       userSchema.contactAddress = [{
            addressType: "Communication",
            addressLine1: "my address",
            addressLine2: '',
            City: "Kochi",
            postalCode: "682021",
            residingcountry: "India",
            landmark: '',
        }] 

        userSchema.favourites = [{
            hospitalid: 1234,
            doctorid: 4567,
            treatmentId: 8912,
        }]

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

    userModel.findOneAndUpdate({ "emailID": userEmailId }, { "$set": {} }, function (err, doc) {//{ $set: { <field1>: <value1>, ... } }
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