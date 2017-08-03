var mongoose = require('mongoose');
var logger = require('../utilities/logger.js');
require('../../model/userDetailsmodel.js');
User = mongoose.model('user_details');

// /api/v1/insertNewUser api call controller
module.exports.insertNewUser = function (req, res) {
    User.create(
        {
            "emailID": "nit.libin@gmail.com",
            "loginPassword": "admin",
            // "userID":'',
            "isdCode": 91,
            "primaryPhonenumber":9740177277,
            "secondaryPhonenumber": 9740177277,
            "whatsappPhonenumber": 9740177277,
            "userTitle": "Mr.",
            "gender": "Male",
            "firstName": "Libin",
            "middleName": '',
            "nickName": '',
            "lastName": "Sebastian",
            "dateofbirth": "18/03/1985",
            "preferredContacttime": "Morning",
            "preferredContactmethod": "email",
            "emailVerified": "Y",
            //"userPicdir": '',
            "userType": "Patient",
            "agentType": "Individual",
            "contactAddress.addressType": "Communication",
            "contactAddress.addressLine1": "my address",
            "contactAddress.addressLine2": '',
            "contactAddress.City": "Kochi",
            "contactAddress.postalCode": "682021",
            "contactAddress.residingcountry": "India",
            "contactAddress.landmark": '',
            //"favourites.eventid":'' ,
            "favourites.hospitalid": 1234,
            "favourites.doctorid": 4567,
            "favourites.treatmentId": 8912,
            //"updated_at": '',            

        }
        , function (err) {
            if (err) { 
                logger.error("Error while inserting record : - " + err)
                return res.json({ "err" : err.message.split(":")[2].trim()});
            }
            return res.send("Data got inserted");
        });
};
