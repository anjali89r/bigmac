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
            doctorSchema.speciality = [{
                specialityName: req.body["specialityName"]
            }]

    }).then(function () {
        doctorSchema.save(function (error, data) {
            if (error) {
                logger.error("Error while inserting record in doctor database: - " + error);
                return res.json({ "Message": error.message });
            }
            else {
                return res.json({ "Message": "Data got inserted successfully in doctor table" });
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
