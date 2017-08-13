﻿var mongoose = require('mongoose');
var Promise = require('promise');
var logger = require('../utilities/logger.js');
require('../../model/hospitalDoctorDetailsModel.js');
var hospitalModel = mongoose.model('hospital_doctor_details');
var counterSchema = require('../../model/identityCounterModel.js');

var collection = 'hospital_doctor_details';

module.exports.createHospitalRecord = function (req, res) {

    var doctorID = 10000
    var departmentID = 10000
    var procedureID = 10000

    var hospitalSchema = new hospitalModel();

    //create doctor promise
    const doctorPromise = new Promise((resolve, reject) =>
        counterSchema.getNext('Treatment.doctor.doctorId', collection, function (id) {
            doctorID = id;
            resolve(doctorID);
        }));

    //create department promise
    const departmentPromise = new Promise((resolve, reject) =>
        counterSchema.getNext('Treatment.departmentId', collection, function (id) {
            departmentID = id;
            resolve(departmentID);
        }));

    //create procedure promise
    const procedurePromise = new Promise((resolve, reject) =>
        counterSchema.getNext('Treatment.procedureid', collection, function (id) {
            procedureID = id;
            resolve(procedureID);
        }));

    //wrap all promises togeter
     Promise.all([doctorPromise, departmentPromise, procedurePromise])
         .then(([doctorID, departmentID, procedureID]) => {
            setData(doctorID, departmentID, procedureID);
        })
         .then(function () {
             hospitalSchema.save(function (error, data) {
                 if (error) {
                     logger.error("Error while inserting record : - " + error)
                     return res.json({ "Message": error.message.split(":")[2].trim() });
                 }
                 else {
                     return res.json({ "Message": "Data got inserted successfully" });
                 }
             })
         })
        .catch(function (err) {
            return res.json({ "Message": err.message});
        })

        //function to set data in db
        function setData(doctorID, departmentID, procedureID) {

            console.log("doctorID " + doctorID)
            hospitalSchema.hospitalName = "Renai MediCity"
            hospitalSchema.hospitalContact.website = "www.abcd.com"
            hospitalSchema.hospitalContact.website = "www.abcd.com"
            hospitalSchema.hospitalContact.contactPersonname = "libin"
            hospitalSchema.hospitalContact.addressLine1 = "addr 1"
            hospitalSchema.hospitalContact.addressLine2 = "addr 2"
            hospitalSchema.hospitalContact.City = "city"
            hospitalSchema.hospitalContact.PostalCode = "123456"
            hospitalSchema.hospitalContact.country = "Indian"
            hospitalSchema.Accreditation.JCI = "Y"
            hospitalSchema.Accreditation.NABH = "Y"
            hospitalSchema.Accreditation.NABL = "Y"
            hospitalSchema.hospitalRating.userRating = 4
            hospitalSchema.hospitalRating.medinovitaRating = 4

            var treatmentLength = 0
            if (typeof (hospitalSchema.schema.Treatment) !== 'undefined') {
                treatmentLength = parseInt(hospitalSchema.schema.Treatment.length) - 1
            }

            hospitalSchema.Treatment = [{
                name: 'Root Canal',
                costUpperBound: 10000,
                costLowerBound: 8000,
                departmentId: departmentID,
                procedureid: procedureID,
                departmentName: 'Dental',
                doctor: [{
                    //doctorId = doctorId;
                    doctorId: doctorID,
                    doctorName: 'Thomas',
                    profilepicdir: 'some directory',
                    medinovitadoctorRating: 4,
                    DoctorUserRating: [{
                        rating: 4,
                        userId: 1234
                    }],
                    speciality: [{
                        specialityName: 'Some speciality'
                    }]
                }],

            }]
        }
    
};
//Function to update hospital details
module.exports.updateHospitalRecord = function (req, res) {

    var hospitalName = req.params.hospitalname;
    var hospitalCity = req.params.hospitalcity;
    var hospitalCountry = req.params.hospitalcountry;

    if (hospitalName == null || hospitalCity == null || hospitalCountry==null ) {
        logger.error("Error while updating hospital record : - hospitalName, hospitalCity and hospitalCountry cannot be null")
        return res.status(500).json({ "Message": "Hospital Name, Hospital City and Hospital Country cannot be null" });
    }

    //loop through request parameters and get value
    var query = {};
    for (var key in req.body) {
        item = req.body[key];
        key = requestToUserModelParamMapping(key)
        query[key] = item;
    }

    hospitalModel.findOneAndUpdate({ "hospitalName": hospitalName, "hospitalContact.City": hospitalCity, "hospitalContact.hospitalCountry": hospitalCountry }, { "$set": query }, function (err, doc) {//{ $set: { <field1>: <value1>, ... } }
        if (err) {
            logger.error("Error while updating record : - " + err.message)
            return res.status(500).json({ "Message": err.message });
        }
        res.status(200).json({ "Message": "Hopsital details for " + hospitalName + " have been updated successfully" });

    });

   
};

//function to get db field name corresponding to form field name
function requestToUserModelParamMapping(reqParamKey) {

    switch (reqParamKey.toLowerCase()) {

        case 'hospitalname': return "hospitalName";

        case 'hospitalid': return "hospitalID";

        case 'hospitalcontact.$.website': return "hospitalContact.$.website";

        case 'hospitalcontact.$.contactpersonname': return "hospitalContact.$.contactPersonname";

        case 'hospitalcontact.$.addressline1': return "hospitalContact.$.addressLine1";

        case 'hospitalcontact.$.city': return "hospitalContact.$.City";

        case 'hospitalcontact.$.country': return "hospitalContact.$.country";

        case 'hospitalcontact.$.postalcode': return "hospitalContact.$.PostalCode";

        case 'hospitalcontact.$.landmark': return "hospitalContact.$.Landmark";

        case 'accreditation.$.jci': return "Accreditation.$.JCI";

        case 'accreditation.$.nabh': return "Accreditation.$.NABH";

        case 'accreditation.$.nabl': return "Accreditation.$.NABL";

        case 'hospitalrating.userrating.$.type': return "hospitalRating.userRating.$.type";

        case 'hospitalrating.medinovitarating.$.type': return "hospitalRating.medinovitaRating.$.type";

        case 'treatment.$.procedureid': return "Treatment.$.procedureid";

        case 'treatment.$.departmentId': return "Treatment.$.departmentId";

        case 'treatment.$.name': return "treatment.$.name";

        case 'treatment.$.costlowerbound': return "Treatment.$.costLowerBound";

        case 'treatment.$.costupperbound': return " Treatment.$.costUpperBound";

        case 'treatment.$.departmentname': return "Treatment.$.departmentName";

        case 'treatment.$.doctor.$.doctorId': return "Treatment.$.doctor.$.doctorId";

        case 'treatment.$.doctor.$.doctorname': return "Treatment.$.doctor.$.doctorName";

        case 'treatment.$.doctor.$.speciality.$.specialityname': return "Treatment.$.doctor.$.speciality.$.specialityName";

        case 'treatment.$.doctor.$.profilepicdir': return "Treatment.$.doctor.$.profilepicdir";

        case 'treatment.$.doctor.$.medinovitadoctorrating': return "Treatment.$.doctor.$.medinovitadoctorRating";

        case 'treatment.$.doctor.$.doctoruserrating.$.userrating': return "Treatment.$.doctor.$.DoctorUserRating.$.userRating";

        case 'treatment.$.doctor.$.doctoruserrating.$.userId': return "Treatment.$.doctor.$.DoctorUserRating.$.userId";

        default: return reqParamKey;

    }
}

module.exports.getTreatmentlist = function (req, res) {
    try{
    if (req.params.treatmentName.toUpperCase() == "ALL") {
        hospitalModel.find().distinct('Treatment.name', function (err, result) {
            if (err) {
                logger.error("Error retrieving the records from DB : - " + err.message)
                return res.status(500).json({ "Message": err.message });
            }
            return res.status(200).json(result.sort());

        });
    }
    else {
         hospitalModel.find().distinct('Treatment.name', function (err, result) {
            if (err)
            {
                logger.error("Error retrieving the records from DB : - " + err.message)
                return res.status(500).json({ "Message": err.message });

            }
            var treatmentArray = []; 
            for (var intvalue = 0; intvalue < result.length; intvalue++)
            {
                if (result[intvalue].toUpperCase().includes(req.params.treatmentName.toUpperCase()))
                    {
                     treatmentArray.push(result[intvalue])

                    }
                                
            }
            
        return res.status(200).json(treatmentArray);
        });
        
    }
    }
    catch (err) {

        return res.status(500).json(err.message);
    
    }
    

}
