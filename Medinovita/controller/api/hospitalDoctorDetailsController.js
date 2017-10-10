var mongoose = require('mongoose');
var Promise = require('promise');
var logger = require('../utilities/logger.js');
require('../../model/hospitalDoctorDetailsModel.js');
var treatmentController=require('./treatmentsOfferedController.js');
var hospitalModel = mongoose.model('hospital_doctor_details');
var counterSchema = require('../../model/identityCounterModel.js');

var collection = 'hospital_doctor_details';

/***************Add hospital, procedure and doctors details of a partucular hospital in hospital record ***************** */
module.exports.createHospitalRecord = function (req, res) {

    if (res.headersSent) {//check if header is already returned
        logger.warn("Response already sent.Hence skipping the function call gethospitalDetailbytreatment")
        return;
    }  

    var hospitalSchema = new hospitalModel();

    //create doctor promise
    const hospitalPromise = new Promise((resolve, reject) => {

        hospitalModel.findOne({
            "hospitalName": req.body['hospitalname'], "hospitalContact.City": req.body['hospitalcontact_city'], "hospitalContact.country": req.body['hospitalcontact_country']
        }, function (err, doc) {
            if (doc != null) {
                logger.warn("Hospital " + req.body['hospitalname'] + " already exists in database");
                return reject(res.status(409).json({ "Message": "Hospital " + req.body['hospitalname'] + " already exists in database" }));
            } else {
                counterSchema.getNext('hospitalID', collection, function (id) {
                    hospitalID = id;
                    resolve(hospitalID);
                })
            }
        })
    })
        
    //create doctor promise
    const doctorPromise = new Promise((resolve, reject) =>
        counterSchema.getNext('Treatment.$.doctor.$.doctorId', collection, function (id) {
            doctorID = id;
            resolve(doctorID);
        }));

    //create department promise
    const departmentPromise = new Promise((resolve, reject) =>{
        /*check if treatment already exists in treatments offered collection*/
        treatmentController.isTreatmentExists(req.body["procedureName"], function (dict) {
            if (Object.keys(dict).length >= 1) {
                resolve(dict['procedureparentDepartmentid']);
            } else {
                counterSchema.getNext('Treatment.$.departmentId', collection, function (id) {
                    departmentID = id;
                    resolve(departmentID);
                });
            }
        });
    });

    //create procedure promise
    const procedurePromise = new Promise((resolve, reject) => {
        /*check if department already exists in treatments offered table */
        treatmentController.isTreatmentExists(req.body["procedureName"], function (dict) {
            if (Object.keys(dict).length>=1){
                resolve(dict['procedureId']);
            } else {
                counterSchema.getNext('Treatment.$.procedureid', collection, function (id) {
                    procedureID = id; 
                    resolve(procedureID);
                })
            }
        });
        
    });

    //wrap all promises togeter
    Promise.all([hospitalPromise,doctorPromise, departmentPromise, procedurePromise])
        .then(([hospitalID,doctorID, departmentID, procedureID]) => {
            setData(hospitalID,doctorID, departmentID, procedureID);
        })
        .then(function () {
            hospitalSchema.save(function (error, data) {
                if (error) {
                    logger.error("Error while inserting record : - " + error);
                    return res.json({ "Message": error.message});
                }
                else {
                    return res.json({ "Message": "Data got inserted successfully" });
                }
            });
        })
        .catch(function (err) {
            return res.json({ "Message": err.message });
        });

    //function to set data in db
    function setData(hospitalID, doctorID, departmentID, procedureID) {

        /*Update treatments offered collection */
        var paramDict = [];
        paramDict['procedureId'] = procedureID
        paramDict['procedureMedicalName'] = req.body["procedureName"];
        paramDict['procedureShortName'] = req.body["procedureShortName"];
        paramDict['procedureaboutFilename'] = "";//this value wont come in hospital model
        paramDict['procedureparentDepartment'] = req.body["departmentName"];
        paramDict['procedureparentDepartmentid'] = departmentID;
        treatmentController.createTreatmentRecord(paramDict, function (doc) { })

        hospitalSchema.hospitalID = hospitalID
        hospitalSchema.hospitalName = req.body['hospitalname'];
        hospitalSchema.serviceActiveFlag = req.body['serviceActiveFlag'];//new
        hospitalSchema.hospitalContact.website = req.body['hospitalcontact_website'];
        hospitalSchema.hospitalContact.contactPersonname = req.body['hospitalcontact_contactpersonname'];
        hospitalSchema.hospitalContact.emailId = req.body['emailId'];//new
        hospitalSchema.hospitalContact.primaryPhoneNumber = parseInt(req.body['primaryPhoneNumber']);//new
        hospitalSchema.hospitalContact.secondaryPhoneNumber = req.body['secondaryPhoneNumber'];//new
        hospitalSchema.hospitalContact.addressLine1 = req.body['hospitalcontact_addressline1'];
        hospitalSchema.hospitalContact.addressLine2 = req.body['hospitalcontact_addressline2'];
        hospitalSchema.hospitalContact.City = req.body['hospitalcontact_city'];
        hospitalSchema.hospitalContact.PostalCode = parseInt(req.body['hospitalcontact_postalcode']);
        hospitalSchema.hospitalContact.country = req.body['hospitalcontact_country'];
        hospitalSchema.Accreditation.JCI = req.body['accreditation_jci'];
        hospitalSchema.Accreditation.NABH = req.body['accreditation_nabh'];
        hospitalSchema.Accreditation.NABL = req.body['accreditation_nabl'];
        //hospitalSchema.hospitalRating.userRating = req.body['hospitalrating_userrating'];//this should come from another api
        hospitalSchema.hospitalRating.medinovitaRating = req.body['hospitalrating_medinovitarating'];

        hospitalSchema.Treatment = [{
            name: req.body["procedureName"],
            activeFlag: req.body["isProcedureActive"],//new
            costUpperBound: parseInt(req.body["costUpperBound"]),
            costLowerBound: parseInt(req.body["costLowerBound"]),
            departmentId: departmentID,
            procedureid: procedureID,
            departmentName: req.body["departmentName"],
            doctor: [{
                doctorId: doctorID,
                doctorName: req.body["doctorName"],
                activeFlag: req.body["isDoctorActive"],//new
                profilepicdir: req.body["profilePicDirectory"],
                medinovitadoctorRating: parseInt(req.body["medinovitaDoctorRating"]),
                //Below field should come via another api.However enabling this for calculating cost api with a default value
                DoctorUserRating: [{
                    userRating: req.body["doctorUserRating"],
                    userId: req.body["userEmailId"],
                }], 
                //DoctorUserRating: [], This needs to be uncommented if doctor user rating to be added as blank
                speciality: [{
                    specialityName: req.body["specialityName"]
                }]
            }]

        }];
    }

};
/* **************End - Add hospital, procedure and doctors details of a partucular hospital in hospital record ***************** */

/* **************Update basic procedure details of a partucular hospital in hospital record ***************** */
module.exports.updateHospitalNameNContactDetails = function (req, res) {

    if (res.headersSent) {//check if header is already returned
        logger.warn("Response already sent.Hence skipping the function call gethospitalDetailbytreatment")
        return;
    }  

    var hospitalSchema = new hospitalModel();

    var hospitalName = req.params.hospitalname;
    var hospitalCity = req.params.hospitalcity;
    var hospitalCountry = req.params.hospitalcountry;

    if (hospitalName === null || hospitalCity === null || hospitalCountry === null) {
        logger.error("Error while updating hospital record : - hospitalName, hospitalCity and hospitalCountry cannot be null");
        return res.status(500).json({ "Message": "Hospital Name, Hospital City and Hospital Country cannot be null" });
    }

    var query = {};
    for (var key in req.body) {
        item = req.body[key];
        key = requestToUserModelParamMapping(key)
        query[key] = item;
    }

    hospitalModel.findOne({
        "hospitalName": hospitalName, "hospitalContact.City": hospitalCity, "hospitalContact.country": hospitalCountry 
    }, function (err, doc) {
        if (doc == null) {
            logger.warn("Hospital " + hospitalName + " does not exists in database");
            return res.status(409).json({ "Message": "Hospital " + hospitalName + " does not exists in database" });
        } else {
            //update basic hospital fields
            hospitalModel.findOneAndUpdate({ "hospitalName": hospitalName, "hospitalContact.City": hospitalCity, "hospitalContact.country": hospitalCountry }, { "$set": query }, { new: true }, function (err, doc) {//{ $set: { <field1>: <value1>, ... } }
                if (err) {
                    logger.error("Error while updating record : - " + err.message);
                    return res.status(500).json({ "Message": err.message });
                } else if (doc === null) {
                    logger.error("Error while updating record : - Hospital not found in database");
                    return res.status(408).json({ "Message": "Hospital not found in database" });
                }
                res.status(200).json({ "Message": "Hopsital details for " + hospitalName + " have been updated successfully" });
            });
        }
    })
};

/* **************End - Update basic procedure details of a partucular hospital in hospital record ***************** */

/* ************** Add new procedure details of a partucular hospital to existing hospital record ****************** */
module.exports.addProcedureDetails = function (req, res) {

    if (res.headersSent) {//check if header is already returned
        logger.warn("Response already sent.Hence skipping the function call addProcedureDetails")
        return;
    }  

    var hospitalSchema = new hospitalModel();

    var hospitalName = req.params.hospitalname;
    var hospitalCity = req.params.hospitalcity;
    var hospitalCountry = req.params.hospitalcountry;
    var procedureName = req.body["procedureName"];
    var doctorName = req.body["doctorName"];

    var treatmentFound = false;
    var doctorFound = false;
   
    //check if api call is passing all relavent informations
    if (hospitalName === null || hospitalCity === null || hospitalCountry === null) {
        logger.error("Error while updating hospital record : - hospitalName, hospitalCity and hospitalCountry cannot be null");
        return res.status(500).json({ "Message": "Hospital Name, Hospital City and Hospital Country cannot be null" });
    }

    //create doctor promise
    const doctorPromise = new Promise((resolve, reject) =>
        counterSchema.getNext('Treatment.$.doctor.$.doctorId', collection, function (id) {
            doctorID = id;
            resolve(doctorID);
        }));

    //create department promise
    const departmentPromise = new Promise((resolve, reject) => {
        /*check if treatment already exists in treatments offered collection*/
        treatmentController.isTreatmentExists(req.body["procedureName"], function (dict) {
            if (Object.keys(dict).length >= 1) {
                resolve(dict['procedureparentDepartmentid']);
            } else {
                counterSchema.getNext('Treatment.$.departmentId', collection, function (id) {
                    departmentID = id;
                    resolve(departmentID);
                });
            }
        });
    });

    //create procedure promise
    const procedurePromise = new Promise((resolve, reject) => {
        /*check if department already exists in treatments offered table */
        treatmentController.isTreatmentExists(req.body["procedureName"], function (dict) {
            if (Object.keys(dict).length >= 1) {
                resolve(dict['procedureId']);
            } else {
                /* update procedure details in treatments offered schema */
                counterSchema.getNext('Treatment.$.procedureid', collection, function (id) {
                    procedureID = id;
                    resolve(procedureID);
                })
            }
        });

    });

    //Create hospital check promise
    const dbHospitalCheckPromise = new Promise((resolve, reject) =>
        //check if hospital details have been already added
        hospitalModel.findOne({
            "hospitalName": hospitalName, "hospitalContact.City": hospitalCity, "hospitalContact.country": hospitalCountry
        }, function (err, doc) {
            if (doc == null) {
                logger.error("Hospital " + hospitalName + " does not exists in database" );
                return reject(res.status(409).json({ "Message": "Hospital " + hospitalName + " does not exists in database" }));
            }
            resolve();
        })
    );

    //Create dbcheck promise
    const dbTreatmentCheckPromise = new Promise((resolve, reject) =>

        //check if procedure details have been already added
        hospitalModel.findOne({
            "hospitalName": hospitalName, "hospitalContact.City": hospitalCity, "hospitalContact.country": hospitalCountry, "Treatment": {
                $elemMatch: { "name": procedureName }
            }
        }, function (err, doc) {
            if (doc !== null) {
                treatmentFound=true
                logger.info("Procedure " + procedureName + "already exists in " + hospitalName + " database" );                
            }
            //check if update action is just to add new doctor details to hospital database
            if (treatmentFound == true) {               
                hospitalModel.findOne({
                    "hospitalName": hospitalName, "hospitalContact.City": hospitalCity, "hospitalContact.country": hospitalCountry, "Treatment": {
                        $elemMatch: {
                            "name": procedureName, "doctor": {
                                $elemMatch: { "doctorName": doctorName }
                            }
                        }
                    }
                }, function (err, doc) {
                    if (doc !== null) {
                        doctorFound = true
                        logger.info("Doctor " + doctorName + " offering " + procedureName + " already exists in " + hospitalName + " database");
                        return reject(res.status(409).json({
                            "Message": "Doctor " + doctorName + " offering " + procedureName + " already exists in " + hospitalName + " database" 
                        }));                        
                    }
                })
            }

            if (treatmentFound == true && doctorFound == true) {
                logger.error("Procedure " + procedureName + " and doctor details are already exists in " + hospitalName + " database")
                return reject(res.status(409).json({ "Message": "Procedure " + procedureName + " and doctor details are already exists in " + hospitalName + " database" }));
            }
            const searchResult = treatmentFound + "|" + doctorFound            
            resolve(searchResult);
            })
    );

    Promise.all([dbHospitalCheckPromise, dbTreatmentCheckPromise, departmentPromise, procedurePromise, doctorPromise])
        .then(([, searchResult , departmentID, procedureID, doctorID ]) => {
           
            var procedureFound = searchResult.split('|')[0];  
            procedureFound = procedureFound == "true";//convert to boolean
            var docFound = searchResult.split('|')[1];
            docFound = docFound == "true";//convert to boolean

            /*Update treatments offered collection */
            var paramDict = [];
            paramDict['procedureId'] = procedureID
            paramDict['procedureMedicalName'] = req.body["procedureName"];
            paramDict['procedureShortName'] = req.body["procedureShortName"];
            paramDict['procedureaboutFilename'] = "";//this value wont come in hospital model
            paramDict['procedureparentDepartment'] = req.body["departmentName"];
            paramDict['procedureparentDepartmentid'] = departmentID;
            treatmentController.createTreatmentRecord(paramDict, function (doc) { })
   
             /* Update hospital and doctor details */
            if (procedureFound === false && docFound == false && doctorName != null) {

                hospitalModel.findOneAndUpdate({ "hospitalName": hospitalName, "hospitalContact.City": hospitalCity, "hospitalContact.country": hospitalCountry },
                    {
                        "$push": {
                            "Treatment": {
                                "name": req.body["procedureName"],
                                "activeFlag": req.body["isProcedureActive"],//new
                                "costUpperBound": parseInt(req.body["costUpperBound"]),
                                "costLowerBound": parseInt(req.body["costLowerBound"]),
                                "departmentId": departmentID,
                                "procedureid": procedureID,
                                "departmentName": req.body["departmentName"],

                                "doctor": {
                                    "doctorId": doctorID,
                                    "activeFlag": req.body["isDoctorActive"],//new
                                    "doctorName": req.body["doctorName"],
                                    "profilepicdir": req.body["profilePicDirectory"],
                                    "medinovitadoctorRating": parseInt(req.body["medinovitaDoctorRating"]),
                                    "speciality": {
                                        "specialityName": req.body["specialityName"]
                                    },
                                    //"DoctorUserRating": []
                                    "DoctorUserRating": { //At least one default rating is required for cost api
                                        "userRating": parseFloat(req.body["doctorUserRating"]),
                                        "userId": req.body["userEmailId"],
                                    },
                                }

                            }
                        }
                    },
                    { new: true }, function (err, doc) {

                        if (err) {
                            logger.error("Error while updating record : - " + err.message);
                            //return res.status(500).json({ "Message": err.message });
                        } else if (doc === null) {
                            logger.error("Error while updating record : - unable to update database");                            
                        }                       
                    });

            /* Update only doctor incase procedure is already added */
            } else if (procedureFound == true && docFound == false && doctorName != null) {
                hospitalModel.findOneAndUpdate({
                    "hospitalName": hospitalName, "hospitalContact.City": hospitalCity, "hospitalContact.country": hospitalCountry, "Treatment": {
                        $elemMatch: { "name": procedureName }
                    }},
                    {
                        "$push": {                            
                            "Treatment.$.doctor": {
                                "doctorId": doctorID,
                                "activeFlag": req.body["isDoctorActive"],//new
                                "doctorName": req.body["doctorName"],
                                "profilepicdir": req.body["profilePicDirectory"],
                                "medinovitadoctorRating": parseInt(req.body["medinovitaDoctorRating"]),
                                "speciality": {
                                    "specialityName": req.body["specialityName"]
                                },
                                //"DoctorUserRating": []
                                "DoctorUserRating": { //At least one default rating is required for cost api
                                    "userRating": parseFloat(req.body["doctorUserRating"]),
                                    "userId": req.body["userEmailId"],
                                },
                            }     
                        }
                    },
                    { new: true }, function (err, doc) {

                        if (err) {
                            logger.error("Error while updating record : - " + err.message);                            
                        } else if (doc === null) {
                            logger.error("Error while updating record : - Unable to update database");                           
                        }                       
                    });

            /* Update only procedure information */
            } else if (procedureFound == false && doctorName == null) {
                hospitalModel.findOneAndUpdate({ "hospitalName": hospitalName, "hospitalContact.City": hospitalCity, "hospitalContact.country": hospitalCountry },
                    {
                        "$push": {
                            "Treatment": {
                                "procedureid": procedureID,
                                "departmentId": departmentID,                               
                                "name": req.body["procedureName"],
                                "activeFlag": req.body["isProcedureActive"],//new
                                "costUpperBound": parseInt(req.body["costUpperBound"]),
                                "costLowerBound": parseInt(req.body["costLowerBound"]),
                                "departmentName": req.body["departmentName"],                                                                
                                "doctor": {
                                    "DoctorUserRating": []
                                }
                            }
                        }
                    },
                    { new: true }, function (err, doc) {

                        if (err) {
                            logger.error("Error while updating record : - " + err.message);
                        } else if (doc === null) {
                            logger.error("Error while updating record : - Unable to update procedure details in database");                            
                        }                        
                    });
            /* any other case */
            } else {
                logger.error("Error while updating record : - Unable to update hospital details in database");               
            }
        }).
        then(function () {
            hospitalSchema.save(function (error, data) {
                if (error) {
                    logger.error("Error while inserting record : - " + error.message);
                    return res.json({ "Message": error.message });
                }
                else {
                    return res.json({ "Message": "Data got inserted successfully" });
                }
            });
        })
        .catch(function (err) {
            return res.json({ "Message": err.message });
        });
}  

/* ************** End -  Add new procedure details of a partucular hospital to existing hospital record *************/

//Add new doctor details
module.exports.addDoctorDetails = function (req, res) {

    if (res.headersSent) {//check if header is already returned
        logger.warn("Response already sent.Hence skipping the function call addDoctorDetails")
        return;
    } 

    var hospitalSchema = new hospitalModel();

    var hospitalName = req.params.hospitalname;
    var hospitalCity = req.params.hospitalcity;
    var hospitalCountry = req.params.hospitalcountry;
    var procedureName = req.params.procedurename;
    var doctorName = req.body["doctorName"];

    //check if api call is passing all relavent informations
    if (hospitalName === null || hospitalCity === null || hospitalCountry === null) {
        logger.error("Error while updating hospital record : - hospitalName, hospitalCity and hospitalCountry cannot be null");
        return res.status(500).json({ "Message": "Hospital Name, Hospital City and Hospital Country cannot be null" });
    }

    //create doctor promise
    const doctorPromise = new Promise((resolve, reject) =>
        counterSchema.getNext('Treatment.doctor.doctorId', collection, function (id) {
            doctorID = id;
            resolve(doctorID);
        }));

    //Create hospital check promise
    const dbHospitalCheckPromise = new Promise((resolve, reject) =>
        //check if hospital details have been already added
        hospitalModel.findOne({
            "hospitalName": hospitalName, "hospitalContact.City": hospitalCity, "hospitalContact.country": hospitalCountry
        }, function (err, doc) {
            if (doc == null) {
                logger.error("Hospital " + hospitalName + "does not exists in database");
                return reject(res.status(409).json({ "Message": "Hospital " + hospitalName + "does not exists in database" }));
            }
            resolve();
        })
    );

    //Create dbcheck promise
    const dbTreatmentCheckPromise = new Promise((resolve, reject) =>
        //check if procedure details have been already added
        hospitalModel.findOne({
            "hospitalName": hospitalName, "hospitalContact.City": hospitalCity, "hospitalContact.country": hospitalCountry, "Treatment": {
                $elemMatch: { "name": procedureName }
            }
        }, function (err, doc) {
            if (doc == null) {
                logger.error("Procedure " + procedureName + " does not exists in " + hospitalName + " database");
                return reject(res.status(409).json({ "Message": "Procedure " + procedureName + "does not exists in " + hospitalName + " database" }));
            }
            resolve();
        })
    );

    //Create dbcheck promise
    const dbDoctorCheckPromise = new Promise((resolve, reject) =>

        //check if procedure details have been already added
        hospitalModel.findOne({
            "hospitalName": hospitalName, "hospitalContact.City": hospitalCity, "hospitalContact.country": hospitalCountry, "Treatment": {
                "doctor": {
                    $elemMatch: { "doctorName": doctorName }
                }
            }
        }, function (err, doc) {
            if (doc !== null) {
                logger.error("Doctor " + doctorName + " offering " + procedureName + "already exists in " + hospitalName + " database");
                return reject(res.status(409).json({
                    "Message": "Doctor " + doctorName + " offering " + procedureName + "already exists in " + hospitalName + " database"
                }));
            }
            resolve();
        })
    );
    Promise.all([dbHospitalCheckPromise, dbTreatmentCheckPromise, dbDoctorCheckPromise, doctorPromise])
        .then(([,,,doctorID]) => {
  
            //add new record
            hospitalModel.findOneAndUpdate({
                "hospitalName": hospitalName, "hospitalContact.City": hospitalCity, "hospitalContact.country": hospitalCountry, "Treatment": {
                    $elemMatch: { "name": procedureName }
                }
            },
                {
                    "$push": {
                        "Treatment.$.doctor": {
                            "doctorId": doctorID,
                            "doctorName": req.body["doctorName"],
                            "activeFlag": req.body["isDoctorActive"],//new
                            "profilepicdir": req.body["profilePicDirectory"],
                            "medinovitadoctorRating": parseInt(req.body["medinovitaDoctorRating"]),
                            "speciality": {
                                "specialityName": req.body["specialityName"]
                            },
                            //"DoctorUserRating": []
                            "DoctorUserRating": { //At least one default rating is required for cost api
                                "userRating": parseFloat(req.body["doctorUserRating"]),
                                "userId": req.body["userEmailId"],
                            }
                        }     
                    }
                },
                { new: true }, function (err, doc) {

                if (err) {
                    logger.error("Error while updating record : - " + err.message);
                    return res.status(500).json({ "Message": err.message });
                } else if (doc === null) {
                    logger.error("Error while updating record : - Hospital not found in database");
                    return res.status(408).json({ "Message": "Hospital not found in database" });
                }
                logger.info("Doctor " + doctorName + " offering " + procedureName + " is added to " + hospitalName + " database" )
                res.status(200).json({ "Message": "Doctor " + doctorName + " offering " + procedureName + " is added to " + hospitalName + " database" });

            });

        })
        .catch(function (err) {
            return res.json({ "Message": err.message });
        });

}  

//function to get db field name corresponding to form field name
function requestToUserModelParamMapping(reqParamKey) {

    switch (reqParamKey.toLowerCase()) {

        case 'hospitalname': return "hospitalName";

        case 'hospitalID': return "hospitalID";

        case 'serviceActiveFlag': return "serviceActiveFlag";

        case 'website': return "hospitalContact.website";

        case 'contactpersonname': return "hospitalContact.contactPersonname";

        case 'emailId': return "hospitalContact.emailId";

        case 'primaryPhoneNumber': return "hospitalContact.primaryPhoneNumber";

        case 'secondaryPhoneNumber': return "hospitalContact.secondaryPhoneNumber";

        case 'hospitalcontact_addressline1': return "hospitalContact.addressLine1";

        case 'hospitalcontact_addressline2': return "hospitalContact.addressLine2";

        case 'hospitalcontact_city': return "hospitalContact.City";

        case 'hospitalcontact_country': return "hospitalContact.country";

        case 'hospitalcontact_postalcode': return "hospitalContact.PostalCode";

        case 'hospitalcontact_landmark': return "hospitalContact.Landmark";

        case 'accreditation_jci': return "Accreditation.JCI";

        case 'accreditation_nabh': return "Accreditation.NABH";

        case 'accreditation_nabl': return "Accreditation.NABL";

        case 'hospitalrating_medinovitarating': return "hospitalRating.medinovitaRating";
        
        default: return reqParamKey;

    }
}


