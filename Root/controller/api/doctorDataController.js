var mongoose = require('mongoose');
var Promise = require('promise');
var logger = require('../utilities/logger.js');
var doctorData = require('../../model/doctorDataModel.js');
var doctorDataModel = mongoose.model('Doctor_Data_Details')

var collection = 'Doctor_Data_Details'; 

/* API to add new treatment description details */
module.exports.addDoctorData = function (req, res) {

    if (res.headersSent) {//check if header is already returned
        logger.warn("Response already sent.Hence skipping the function call addDoctorData")
        return;
    }

    var saveFlag = false

    var doctorSchema = new doctorDataModel();

    new Promise(function (resolve, reject) {
        //check if doctor is already exists 
        doctorDataModel.findOne({ registrationNumber: req.body["registrationNumber"], registrationAuthority: req.body["registrationAuthority"] }
            , function (err, doc) {
                if (doc != null) {
                    return reject(res.status(409).json({ "Message": "Doctor with registration number " + req.body['registrationNumber'] + " already exists in database" }));
                } else {
                    resolve()
                }
            })
    }).then(function () {
            doctorSchema.registrationNumber = req.body["registrationNumber"],
            doctorSchema.registrationAuthority = req.body["registrationAuthority"],
            doctorSchema.doctorName = req.body["doctorName"],
            doctorSchema.doctorDescription = req.body["doctorDescription"],
            doctorSchema.activeFlag = req.body["isDoctorActive"],//new
            doctorSchema.profilepicdir = req.body["profilePicDirectory"],
            doctorSchema.medinovitadoctorRating = parseInt(req.body["medinovitaDoctorRating"]),
            //Below field should come via another api.However enabling this for calculating cost api with a default value
            doctorSchema.DoctorUserRating = [{
                userRating: req.body["doctorUserRating"],
                userId: req.body["userEmailId"],
            }],
            //DoctorUserRating: [], This needs to be uncommented if doctor user rating to be added as blank
            doctorSchema.speciality = req.body["specialityName"]               

    }).then(function () {
        doctorSchema.save(function (error, data) {
            if (error) {
                logger.error("Error while inserting record in doctor database: - " + error);
                return res.status(500).json({ "Message": error.message });
            }
            else {
                return res.status(201).json({ "Message": "Data got inserted successfully in doctor table" });
            }
        });

    }).catch(function (err) {
        return res.json({ "Message": err.message });
    });
}

module.exports.isDoctorExists = function (docRegistrationNumber,docRegAuthority, callback) {

    doctorDataModel.findOne({ registrationNumber: docRegistrationNumber, registrationAuthority: docRegAuthority }, {
        "doctorName": 1, "doctorDescription": 1, "_id": 0
    }, function (err, doc) {//{ $set: { <field1>: <value1>, ... } }
        if (err) {
            callback("false");
        } else if (doc != null) {
            callback("true");
        } else {
            callback("false");
        }
    });
}

module.exports.getDoctorByRegNumber = function (docRegistrationNumber,docRegAuthority) {
    
    return new Promise((resolve, reject) => { 
        doctorDataModel.aggregate([       
            {
            // "$match": { "$and": [{ "registrationNumber": docRegistrationNumber }, { "registrationAuthority": docRegAuthority },{ "activeFlag": "Y" }] }
            "$match": { 
                "$and": [
                    { "registrationNumber": docRegistrationNumber },{ "activeFlag": "Y" }, { "registrationAuthority": docRegAuthority }               
                    ]
                }             
            },               
            {
                $project: {
                    "_id": 0,
                    "doctorName": 1,
                    "doctorShortName" : 1,
                    //"doctorDescription": 1,
                    "speciality": 1,
                    "profilepicdir": 1,
                    "medinovitadoctorRating"  :1,
                    "registrationNumber":1,
                    "registrationAuthority":1

                }
            }

        ], function (err, result) {

            if (err) {
                logger.error("Error while fetching doctor details from doctor details schema");
                resolve(result)
            } else if (!result.length) {
                logger.error("There is no doctor records available for registration number " + docRegistrationNumber);
                resolve(result)
            } else {
                resolve(result)            
            }
        })
    })
}


