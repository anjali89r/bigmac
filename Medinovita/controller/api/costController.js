var mongoose = require('mongoose');
var Promise = require('promise');
var logger = require('../utilities/logger.js');

require('../../model/hospitalDoctorDetailsModel.js');
var hospitalModel = mongoose.model('hospital_doctor_details');
require('../../model/holidayPackageModel.js');
var holidayModel = mongoose.model('holiday_package');
require('../../model/accomodationInfoModel.js');
var hotelModel = mongoose.model('hotel_details');
require('../../model/treatmentsDescModel.js');
var treatmentDescModel = mongoose.model('treatmentOffered_description');
require('../../model/localTransportModel.js');
var transportModel = mongoose.model('local_transport_details');

module.exports.getTreatmentRoughEstimate = function (req, res) {

    if (res.headersSent) {//check if header is already returned
        logger.warn("Response already sent.Hence skipping the function call getTreatmentRoughEstimate")
        return;
    }
    var procedureName = req.query.procedurename;
    var holidayPackage = req.query.holidaypackage;
    var numPassengers = req.query.bystandercount;
    var hotelType = req.query.hotelrate;

    //Initial validation
    if ((procedureName == null) || (numPassengers == null)) {
        logger.warn("Response already sent.Hence skipping the function call getTreatmentRoughEstimate")
        res.status(500).json({ "Message": "Mandatory input values missing" })
        return
    }

    const hospitalInfoPromise = getHospitalOfferingTreatment(req, res);
    const procedureCostPromise = getAvarageCost(req, res)
    const holidayCostPromise = getHolidayPackageCost(req, res)
    const accomodationCostPromise = getAccomodationCost(req, res)
    const localTransportCostPromise = getLocalTransportCost(req, res)

    Promise.all([hospitalInfoPromise, procedureCostPromise, holidayCostPromise, accomodationCostPromise, localTransportCostPromise])
        .then(([hospitalInfo, procedureCost, holidayCost, accomodationCost, localTransportCost]) => {
            if (res.headersSent) {//check if header is already returned
                logger.warn("Response already sent.Hence skipping the function call getTreatmentRoughEstimate")
                return;
            }
            //Calculate total expenses
            var retProcedureCost = procedureCost[0].avarageTreatmentCost;
            logger.info("Procedure cost - " + retProcedureCost )
            var retHolidayCost = holidayCost[0].totalPackageCost;
            logger.info("Holiday cost - " + retHolidayCost)
            var retAccomodationCost = accomodationCost[0].totalAccomodationCost;
            logger.info("Accomodation cost - " + retAccomodationCost)
            var retLocalTransportCost = localTransportCost[0].totalTransportationCost
            logger.info("Local transport cost - " + retLocalTransportCost)

            var tripExpense = retProcedureCost + retHolidayCost + retAccomodationCost + retLocalTransportCost;
            logger.info("Overall trip cost - " + tripExpense)
            //Convert to json
            var totalTripExpense = JSON.parse('{ "mediTourEstimate": ' + tripExpense + '}');
            //Return response
            return res.status(200).json({ "totalExpense": totalTripExpense, "HopsitalsOfferingTreatment": hospitalInfo, "ProcedureAvarageCost": procedureCost, "holidayCost": holidayCost, "accomodationExpense": accomodationCost, "localTransportCost": localTransportCost });

    }).catch(function (err) {
        return res.json({ "Message": err.message });
    });    
}

/* Get the list of hospitals and doctors offering a paricular traetment passed as an argument */
var getHospitalOfferingTreatment = function (req, res) {

    var procedureName = req.query.procedurename;

    var hospitallistPromise = new Promise(function (resolve, reject) {

        hospitalModel.aggregate([  
            {
                //"$match": { "serviceActiveFlag": "Y" } 
                "$match": { "$and": [{ "serviceActiveFlag": "Y" }, { "Treatment.name": procedureName }, { "Treatment.activeFlag": { $in: ["Y"] } }] }
            },
            {
                "$project": {
                    "_id": 0,
                    "hospitalName": 1,                   
                    "hospitalContact.website": 1,
                    "hospitalContact.addressLine1": 1,
                    "hospitalContact.addressLine2": 1,
                    "hospitalContact.City": 1,
                    "hospitalContact.PostalCode": 1,
                    "hospitalContact.country": 1,
                    "hospitalContact.Landmark": 1,
                    "Accreditation.JCI": 1,
                    "Accreditation.NABH": 1,
                    "Accreditation.NABL": 1,
                    //filter treatment array
                    "Treatment": {
                        "$setDifference": [
                            {
                                "$map": {
                                    "input": "$Treatment",
                                    "as":"procedure",
                                    "in": {
                                        "$cond": [//Filter using the procedure name passed as an argument
                                            {
                                                "$and": [
                                                    { "$eq": ["$$procedure.name", procedureName] },
                                                    { "$eq": ["$$procedure.activeFlag", 'Y'] }
                                                ]},                                   
                                            { //Fields to return from array
                                                "costUpperBound": "$$procedure.costUpperBound",
                                                "costLowerBound": "$$procedure.costLowerBound",
                                                //doctor array
                                                "doctor": {

                                                    "$map": {
                                                        "input": "$$procedure.doctor",
                                                        "as": "doctor",
                                                        "in": {
                                                            "$cond": [//specify the filter for doctor
                                                                {
                                                                    "$eq": ["$$doctor.activeFlag", "Y"]
                                                                },
                                                                {
                                                                    "doctorName": "$$doctor.doctorName", "doctorSpeciality": "$$doctor.speciality", "profilepicdir": "$$doctor.profilepicdir",

                                                                    "DoctorUserRating": {

                                                                        "$map": {
                                                                            "input": "$$doctor.DoctorUserRating",
                                                                            "as": "docUserRate",
                                                                            "in": {
                                                                                "$cond": [
                                                                                {},//specify the filter for user rating
                                                                                { //Calculate avarage 
                                                                                  "averageDocRate": { "$avg": "$$docUserRate.userRating" }                                                                               
                                                                                },
                                                                                false
                                                                                ],
                                                                            },//"in": {
                                                                        },//"$map": {
                                                                    },//"DoctorUserRating": {
                                                                    "medinovitadoctorRating": "$$doctor.medinovitadoctorRating"
                                                                },
                                                                false
                                                            ],
                                                        },//"in": {
                                                    },//"$map": {
                                                },//"doctor": { 
                                            },
                                            false
                                        ]
                                    }
                                }
                            },
                            [false]
                        ]
                    }
                }
            }
        ], function (err, result) {

            if (err) {
                logger.error("Error while reading treatment cost details from from DB");
                reject(JSON.stringify({ "Message": err.message.trim() }));
            } else if (!result.length) {
                logger.info("There are no active treatment records present in database");
                reject(JSON.stringify({ "Message": "There are no active treatment records present in database" }));
            }
            else { 
                resolve(JSON.parse(JSON.stringify(result)))
            }
        })

    })
    return hospitallistPromise;
}

/* Get avarage cost of treatment */
var getAvarageCost = function (req, res) {

    if (res.headersSent) {//check if header is already returned
        logger.warn("Response already sent.Hence skipping the function call getTreatmentRoughEstimate")
        return;
    }

    var procedureName = req.query.procedurename;

    var procedureCostPromise = new Promise(function (resolve, reject) {

        hospitalModel.aggregate([
            {
                "$match": { "$and": [{ "serviceActiveFlag": "Y" }, { "Treatment.name": procedureName }, { "Treatment.activeFlag": { $in: ["Y"] } }] }
            }, 
            { "$unwind": "$Treatment" },
            {
                $group: {
                    _id: null,
                    "avarageTreatmentCost": {
                        $avg: "$Treatment.costLowerBound"
                    }
                }
            }

        ], function (err, result) {

            if (err) {
                logger.error("Error while reading treatment cost details from from DB");
                reject(JSON.stringify({ "Message": err.message.trim() }));
            } else if (!result.length) {
                logger.info("There are no active treatment records present in database");
                reject(JSON.stringify({ "Message": "There are no active treatment records present in database" }));
            }
            else {               
                resolve(JSON.parse(JSON.stringify(result)))
            }
        })

    })
    return procedureCostPromise;
}

/* Get cost of holiday package */
var getHolidayPackageCost = function (req, res) {

    if (res.headersSent) {//check if header is already returned
        logger.warn("Response already sent.Hence skipping the function call getHolidayPackageCost")
        return;
    }
    var holidayPackage = req.query.holidaypackage;
    var numPassengers = parseInt(req.query.bystandercount);
    if (holidayPackage == null) {
        return (JSON.parse(JSON.stringify({ "totalPackageCost": "NA" })))
    }

    var holidayCostPromise = new Promise(function (resolve, reject) {

        holidayModel.aggregate([            
            {
                "$match": { "$and": [{ "activeStatus": "Y" }, { "packageShortName": holidayPackage }] }
            }, 
            {
                "$project": {
                    "_id": 0,
                    "totalPackageCost": { $multiply: ["$packageCost", numPassengers] },
                }
            }
        ], function (err, result) {

            if (err) {
                logger.error("Error while reading holiday packages from from DB");  
                reject(JSON.parse(JSON.stringify({ "totalPackageCost": 0 })));
            } else if (!result.length) {
                logger.info("There are no active holiday packages present in database");
                reject(JSON.parse(JSON.stringify({ "totalPackageCost":0 })));
            }
            else {
                resolve(JSON.parse(JSON.stringify(result)))
            }
        })

    })
    return holidayCostPromise;
}

/* Get cost of accomodation */
var getAccomodationCost = function (req, res) {

    if (res.headersSent) {//check if header is already returned
        logger.warn("Response already sent.Hence skipping the function call getAccomodationCost")
        return;
    }

    var hotelType = req.query.hotelrate;//pass 3-star by default
    var numPassengers = parseInt(req.query.bystandercount);
    var procedureName = req.query.procedurename;

    var numDoubleBedRoomsTobeBooked = 1
    var numSingleBedRoomsTobeBooked = 0

    if (hotelType == null || numPassengers==null) {
        return (JSON.parse(JSON.stringify({ "totalAccomodationCost": 0 })))
    }

    if (numPassengers <= 2) {
        numDoubleBedRoomsTobeBooked=1
    } else if (numPassengers==3){
        numDoubleBedRoomsTobeBooked = 1
        numSingleBedRoomsTobeBooked = 1
    } else {
        numDoubleBedRoomsTobeBooked = 2
    }

    return new Promise(function (resolve, reject) {
        getHospitalStayDuration(req, res, function (duration) {
            resolve(duration)
        })
    })
    .then(function (duration) {

        return new Promise(function (resolve, reject) {

            hotelModel.aggregate([
                {
                    "$match": { "$and": [{ "serviceActiveFlag": "Y" }, { "hotelRating": hotelType }] }
                },
                {
                    "$project": {
                        "_id": 0,
                        "dailyAccomodationCost": {
                            $sum: [
                                //{ $multiply: [{ $multiply: [{ "$avg": "$cost.doubleBedRoomCost" }, numDoubleBedRoomsTobeBooked] }, duration] },
                                { $multiply: [{ "$avg": "$cost.doubleBedRoomCost" }, numDoubleBedRoomsTobeBooked ] },
                                { $multiply: [{ "$avg": "$cost.singleBedRoomCost" }, numSingleBedRoomsTobeBooked] }
                                // { $multiply: [{ $multiply: [{ "$avg": "$cost.singleBedRoomCost" }, numSingleBedRoomsTobeBooked] }, duration] }
                            ]
                        },
                        "totalAccomodationCost": {
                            $sum: [
                                //{ $multiply: [{ $multiply: [{ "$avg": "$cost.doubleBedRoomCost" }, numDoubleBedRoomsTobeBooked] }, duration] },
                                { $multiply: [{ "$avg": "$cost.doubleBedRoomCost" }, numDoubleBedRoomsTobeBooked * duration] },
                                { $multiply: [{ "$avg": "$cost.singleBedRoomCost" }, numSingleBedRoomsTobeBooked * duration] }
                                // { $multiply: [{ $multiply: [{ "$avg": "$cost.singleBedRoomCost" }, numSingleBedRoomsTobeBooked] }, duration] }
                            ]
                        }
                    }
                }
            ], function (err, result) {

                if (err) {
                    logger.error("Error while reading accomodation cost from from DB");
                    reject(JSON.parse(JSON.stringify({ "totalAccomodationCost": 0 })));
                } else if (!result.length) {
                    logger.info("There are no active hotel details present in database");
                    reject(JSON.parse(JSON.stringify({ "totalAccomodationCost": 0 })));
                }
                else {
                    resolve(JSON.parse(JSON.stringify(result)))
                }
            })

        })
    })
}

/* Get number of days to be present in a country for a particular treatment */
var getHospitalStayDuration = function (req, res, callback) {

    var treatmentName = req.query.procedurename

    treatmentDescModel.aggregate([
        { "$match": {
            "$and": [{ "serviceActiveFlag": "Y" }, { "treatmentList.procedureName": req.query.procedure }, { "treatmentList.activeFlag": "Y" }] }},

        { "$project": { "_id": 0, "treatmentList.minHospitalization": 1} }

    ], function (err, result) {

        if (err) {
            logger.error("Error while reading treatment duration from DB");
            callback(1)
        } else if (!result.length) {
            logger.error("There is no treatment description available for the treatment in treatment description model");
            callback(1);
        }
        else {                              
            callback(result[0].minHospitalization);
        }
    })

}

/* Get cost of local transport */
var getLocalTransportCost = function (req, res) {

    if (res.headersSent) {//check if header is already returned
        logger.warn("Response already sent.Hence skipping the function call getLocalTransportCost")
        return;
    }
    /*This function always assume that 

        1.Patient will opt for sedan
        2.Patient will be staying within 15 km radius of hospital
        3.Patient/Dependent use transportation facility twice a day
        4.20% of the total cost will be added as buffer for other travel expense
    */

    var vehicleType = req.query.vehicletype
    var distanceToHospital = 15 //km
    if (vehicleType == null) {
        vehicleType = 'sedan';
    }

    return new Promise(function (resolve, reject) {
        getHospitalStayDuration(req, res, function (duration) {
            resolve(duration)
        })
    })
    .then(function (duration) {

        return new Promise(function (resolve, reject) {

            transportModel.aggregate([
                {
                    "$match": { "$and": [{ "serviceActiveFlag": "Y" }, { "vehicle.vehicleType": vehicleType }, { "vehicle.activeFlag": 'Y' }] }
                },
                {
                    "$project": {
                        "_id": 0,
                        "dailyTransportationCost": {
                            $sum: [                                    
                                { $multiply: [{ "$avg": "$vehicle.chargePerKiloMeter" }, (distanceToHospital * 2) ] },                                                                       
                            ]
                        },
                        "totalTransportationCost": {
                            $sum: [
                                { $multiply: [{ "$avg": "$vehicle.chargePerKiloMeter" }, (distanceToHospital * 2) * duration] },
                            ]
                        }
                    }
                }
            ], function (err, result) {

                if (err) {
                    logger.error("Error while reading transportation cost from from DB");
                    reject(JSON.parse(JSON.stringify({ "totalTransportationCost": 0 })));
                } else if (!result.length) {
                    logger.info("There are no active transportation details present in database");
                    reject(JSON.parse(JSON.stringify({ "totalTransportationCost": 0 })));
                }
                else {
                    resolve(JSON.parse(JSON.stringify(result)))
                }
            })

        })
    })
}
