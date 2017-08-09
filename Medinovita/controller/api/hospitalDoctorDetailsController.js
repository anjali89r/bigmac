var mongoose = require('mongoose');
var Promise = require('promise');
var logger = require('../utilities/logger.js');
require('../../model/hospitalDoctorDetailsModel.js');
var hospitalModel = mongoose.model('hospital_doctor_details');
var counterSchema = require('../../model/identityCounterModel.js');

var collection = 'hospital_doctor_details';

module.exports.insertTreatmentDetails = function (req, res) {

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
            if (typeof (hospitalSchema.schema.Treatment) != 'undefined') {
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

