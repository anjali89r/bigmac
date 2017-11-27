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
var evisaCost = require('./evisacountryController.js');
/**************************************************************************************************
                               Logic for calculating cost
1.From hospitalDoctorDetailsModel get list of hospitals offering a particular treatment(getHospitalOfferingTreatment)
2.Get avarage treatment cost from hospitalDoctorDetailsModel(getAvarageCost).
  This is calualated using the avarage of the cost from various hospitals for the same procedure
3.Calculate the cost of holiday based on the number of bystanders + patient (getHolidayPackageCost)
4.Cost of accomodation for patient + bysstander(getAccomodationCost).This function also query treatmentDescModel to caluclate the
  time to be spent in India as apart of treatment(getHospitalStayDuration)
5.Calculate the local transport cost based on assumptions and duration of stay in India(getLocalTransportCost).Please refer
  function header to understand assumptions
6.Get cost of Visa - yet to be developed
7.Cost of flight ticket to India
8.20% of the overall cost is the other expense cost
**************************************************************************************************
                            Data Requirement
1./api/v1/add/hospitalrecord/:apiTokenName - Add hospital details and cost of treatment
2./api/v1/add/doctorsofferingtreatment/:hospitalname/:hospitalcity/:hospitalcountry/:procedurename/:apiTokenName - Add  doctors offering a particular treatment
3./api/v1/post/holidayPackage/:apiTokenName - Add holiday package details
4./api/v1/post/newtransport/vendor/:apiTokenNam - Add local transport details
5./api/v1/post/newhotel/vendor/:apiTokenName - Add accomodation details
6./api/v1/post/treatmentdescription/:apiTokenName -Add procedure details to table,especially hospital stay for a treatment
7.                                                - Cost of Visa
8.                                                - Cost of flight ticket to India
/**************************************************************************************************/

var dollerRate = 65;

/* wrapper function for external usage */
module.exports.getTreatmentRoughEstimate_API = function (req, res) {
    getTreatmentRoughEstimate(req, res, function (data) {
        return res.status(200).json(data);
    })    
}

module.exports.getTreatmentRoughEstimate = getTreatmentRoughEstimate;//for external usage
function getTreatmentRoughEstimate(req, res,callback) {

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

    //const hospitalInfoPromise = getHospitalOfferingTreatment(req, res);
    const procedureCostPromise = getAvarageCost(req.query.procedurename)
    const holidayCostPromise = getHolidayPackageCost(req, res)
    const accomodationCostPromise = getAccomodationCost(req, res)
    const localTransportCostPromise = getLocalTransportCost(req, res)
    const hsopitalStaytPromise = getLocalTransportCost(req, res)
    const evisaFeePromise = geteVisaCost(req, res)

    Promise.all([procedureCostPromise, holidayCostPromise, accomodationCostPromise, localTransportCostPromise, evisaFeePromise])
        .then(([procedureCost, holidayCost, accomodationCost, localTransportCost,evisaFee]) => {
            if (res.headersSent) {//check if header is already returned
                logger.warn("Response already sent.Hence skipping the function call getTreatmentRoughEstimate")
                return;
            }            
            //Calculate total expenses
            var retProcedureCost = procedureCost[0].avarageTreatmentCost;
            logger.info("Procedure cost - " + retProcedureCost) 
            var retVisaFee = evisaFee[0].fee 
            logger.info("visa cost - " + retVisaFee)
            var retHolidayCost = holidayCost[0].totalPackageCost;            
            logger.info("Holiday cost - " + holidayCost[0].totalPackageCost)
            var retAccomodationCost = accomodationCost[0].totalAccomodationCost;
            logger.info("Accomodation cost - " + retAccomodationCost)
            var retLocalTransportCost = localTransportCost[0].totalTransportationCost
            logger.info("Local transport cost - " + retLocalTransportCost)
            //Calculate totla trip expenses
            var tripExpense = retProcedureCost + retHolidayCost + retAccomodationCost + retLocalTransportCost + retVisaFee;
            //add 20% buffer
            tripExpense = Math.round(tripExpense + (tripExpense * 20) / 100)
            logger.info("Overall trip cost - " + tripExpense)
            //Convert to json
            var totalTripExpense = JSON.parse('{ "mediTourEstimate": ' + tripExpense + '}');
            //Return response
            callback({ "totalExpense": totalTripExpense, "ProcedureAvarageCost": procedureCost, "holidayCost": holidayCost, "visaFee": evisaFee,"accomodationExpense": accomodationCost, "localTransportCost": localTransportCost });

        }).catch(function (err) {
            return res.json({ "Message": err.message });
        });
}

/* Get the list of hospitals and doctors offering a paricular traetment passed as an argument */
var getHospitalOfferingTreatment = function (req, res) {

    var procedureName = req.query.procedurename;

    if (procedureName == null) {
        logger.error("Procedure name is blank");
        return (JSON.stringify({
            "Message": "Please select a valid procedure name"
        }));
    }


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
                                    "as": "procedure",
                                    "in": {
                                        "$cond": [//Filter using the procedure name passed as an argument
                                            {
                                                "$and": [
                                                    { "$eq": ["$$procedure.name", procedureName] },
                                                    { "$eq": ["$$procedure.activeFlag", 'Y'] }
                                                ]
                                            },
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
var getAvarageCost = function (procedureName) {
   
    if (procedureName == null) {
        logger.error("Procedure name is blank");
        return (JSON.stringify({
            "avarageTreatmentCost": 0
        }));
    }

    var procedureCostPromise = new Promise(function (resolve, reject) {

        hospitalModel.aggregate([
            {
                "$match": { "$and": [{ "serviceActiveFlag": "Y" }, { "Treatment.name": procedureName }, { "Treatment.activeFlag": { $in: ["Y"] } }] }
            },
            { "$unwind": "$Treatment" },            
            
            { "$project": { "_id": 0, "Treatment.costLowerBound": 1, "Treatment.currency": 1 } }
        ], function (err, result) {

            if (err) {
                logger.error("Error while reading treatment " + procedureName + " cost details from from DB");
                resolve(JSON.parse(JSON.stringify([{ "avarageTreatmentCost": 0 }])));
            } else if (!result.length) {
                logger.error("There are no active treatment records present in database for " + procedureName);
                resolve(JSON.parse(JSON.stringify([{
                    "avarageTreatmentCost": 0
                }])));
            }
            else {                
                var actualcost = 0   
                    for (i = 0; i <result.length; i++) {
                        var cost = result[i].Treatment.costLowerBound
                        var currency = result[i].Treatment.currency
                        if (currency = "INR") { //currency conversion logic
                            cost = cost / dollerRate
                        }                      
                        actualcost = actualcost + cost                        
                    }
                    var avarageCost = Math.round(actualcost / result.length)                 
                    resolve(JSON.parse(JSON.stringify([{ "avarageTreatmentCost": avarageCost }])))             
            }
        })

    })
    return procedureCostPromise;
}

/* Get avarage cost of treatment - old logic used in the script where there is no currency conversion used*/
var getAvarageCost_old = function (procedureName) {

    if (procedureName == null) {
        logger.error("Procedure name is blank");
        return (JSON.stringify({
            "avarageTreatmentCost": 0
        }));
    }

    var procedureCostPromise = new Promise(function (resolve, reject) {

        hospitalModel.aggregate([
            {
                "$match": { "$and": [{ "serviceActiveFlag": "Y" }, { "Treatment.name": procedureName }, { "Treatment.activeFlag": { $in: ["Y"] } }] }
            },
            { "$unwind": "$Treatment" },
            {
                $group: {
                    //_id: null,  
                    _id: { procedure: procedureName },
                    //procedure": { "$first": "$Treatment.name" },                      
                    "avarageTreatmentCost": {
                        $avg: "$Treatment.costLowerBound"
                    }
                }
            },
            // { "$project": { "_id": 0, "procedure": 1, "avarageTreatmentCost": 1 } }
        ], function (err, result) {

            if (err) {
                logger.error("Error while reading treatment " + procedureName + " cost details from from DB");
                reject(JSON.stringify({ "avarageTreatmentCost": 0 }));
            } else if (!result.length) {
                logger.error("There are no active treatment records present in database for " + procedureName);
                reject(JSON.stringify({
                    "avarageTreatmentCost": 0
                }));
            }
            else {                
                resolve(JSON.parse(JSON.stringify(result)))
            }
        })

    })
    return procedureCostPromise;
}

/* Get avarage cost of treatment.Only difference is this will retun integr not promise.Written for treatment description api */
module.exports.getAvarageCostAsInt = function (procedureName) {
    return getAvarageCost(procedureName)
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
        logger.info("No holiday package has been selected")
        return (JSON.parse(JSON.stringify([{ "totalPackageCost": 0 }])))
    }

    var holidayCostPromise = new Promise(function (resolve, reject) {

        holidayModel.aggregate([
            {
                "$match": { "$and": [{ "activeStatus": "Y" }, { "packageShortName": holidayPackage }] }
            },
            {
                "$project": {
                    "_id": 0,                    
                    "totalPackageCost": { 
                        "$cond": {
                            "if": {
                                "$eq": ["$currency", 'INR']
                            },
                            "then": {
                                $ceil: { $divide: [{ $multiply: ["$packageCost", numPassengers] }, dollerRate] }},
                            "else": { $ceil: { $multiply: ["$packageCost", numPassengers] } },
                        }
                    } 
                }
            }
        ], function (err, result) {
            if (err) {
                logger.error("Error while reading holiday packages from from DB");
                resolve(JSON.parse(JSON.stringify([{ "totalPackageCost": 0 }])));
            } else if (!result.length) {
                logger.info("There are no active holiday packages with name " + holidayPackage + " present in database");
                resolve(JSON.parse(JSON.stringify([{ "totalPackageCost": 0 }])));
            }
            else {
                logger.info(JSON.stringify(result))
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

    if (hotelType == null || numPassengers == null) {
        return (JSON.parse(JSON.stringify([{ "totalAccomodationCost": 0 }])))
    }

    if (numPassengers <= 2) {
        numDoubleBedRoomsTobeBooked = 1
    } else if (numPassengers == 3) {
        numDoubleBedRoomsTobeBooked = 1
        numSingleBedRoomsTobeBooked = 1
    } else {
        numDoubleBedRoomsTobeBooked = 2
    }

    return new Promise(function (resolve, reject) {
        getHospitalStayDuration(procedureName, function (duration) {
            resolve(duration[0].treatmentList.minHospitalization)
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
                            "$cond": {
                                "if": {
                                    "$eq": ["$cost.currency", 'INR']
                                },
                                "then": {
                                    $ceil: {
                                        $divide: [{
                                            $sum:
                                            [
                                                { $multiply: [{ "$avg": "$cost.doubleBedRoomCost" }, numDoubleBedRoomsTobeBooked] },
                                                { $multiply: [{ "$avg": "$cost.singleBedRoomCost" }, numSingleBedRoomsTobeBooked] }
                                            ]
                                        }, dollerRate]
                                    }

                                },
                                "else": {
                                    $sum: [
                                        { $multiply: [{ "$avg": "$cost.doubleBedRoomCost" }, numDoubleBedRoomsTobeBooked] },
                                        { $multiply: [{ "$avg": "$cost.singleBedRoomCost" }, numSingleBedRoomsTobeBooked] }
                                    ]
                                }
                            }
                        }, "totalAccomodationCost": {
                            "$cond": {
                                "if": {
                                    "$eq": ["$cost.currency", 'INR']
                                },
                                "then": {
                                    $ceil: {
                                        $divide: [{
                                            $sum:
                                            [
                                                { $multiply: [{ "$avg": "$cost.doubleBedRoomCost" }, numDoubleBedRoomsTobeBooked * duration] },
                                                { $multiply: [{ "$avg": "$cost.singleBedRoomCost" }, numSingleBedRoomsTobeBooked * duration] }
                                            ]
                                        }, dollerRate]
                                    }

                                },
                                "else": {
                                    $sum: [
                                        { $multiply: [{ "$avg": "$cost.doubleBedRoomCost" }, numDoubleBedRoomsTobeBooked * duration] },
                                        { $multiply: [{ "$avg": "$cost.singleBedRoomCost" }, numSingleBedRoomsTobeBooked * duration] }
                                    ]
                                }
                            }
                        }
                    },
                                            
                },
            ], function (err, result) {

                if (err) {
                    logger.error("Error while reading accomodation cost from from DB");
                    resolve(JSON.parse(JSON.stringify([{ "totalAccomodationCost": 0 }])));
                } else if (!result.length) {
                    logger.info("There are no active hotel details present in database");
                    resolve(JSON.parse(JSON.stringify([{ "totalAccomodationCost": 0 }])));
                }
                else {
                    resolve(JSON.parse(JSON.stringify(result)))
                }
            })

        })
    })
}

/* Get number of days to be present in a country for a particular treatment */
module.exports.getHospitalStayDuration = getHospitalStayDuration
function getHospitalStayDuration (treatmentName, callback) {

    //var treatmentName = req.query.procedurename

    treatmentDescModel.aggregate([
        {
            "$match": {
                "$and": [{ "serviceActiveFlag": "Y" }, { "treatmentList.procedureName": treatmentName }]
                // "$and": [{ "serviceActiveFlag": "Y" }, { "treatmentList.procedureName": treatmentName }, { "treatmentList.activeFlag": "Y" }]
            }
        }, { "$unwind": "$treatmentList" }, { $match: { "treatmentList.activeFlag": 'Y' } },

        { "$project": { "_id": 0, "treatmentList.minHospitalization": 1, "treatmentList.maxHospitalization": 1 } }

    ], function (err, result) {

        if (err) {
            logger.error("Error while reading treatment " + treatmentName + " duration from DB");
            //Assuming minimum stya of 5 days in india
            callback(JSON.parse(JSON.stringify([{ "treatmentList.minHospitalization": 5, "treatmentList.maxHospitalization":5 }])))
        } else if (!result.length) {
            logger.error("There is no treatment description available for the treatment " + treatmentName + " in treatment description model");
            callback(JSON.parse(JSON.stringify([{ "treatmentList.minHospitalization": 5, "treatmentList.maxHospitalization": 5 }])))
        } 
        else {
            //callback(result[0].treatmentList.minHospitalization);           
            callback(result)
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
        4.Taxi operator charge for onward & return journey in a single trip
        5.20% of the total cost will be added as buffer for other travel expense
    */

    var vehicleType = req.query.vehicletype
    var procedureName = req.query.procedurename
    var distanceToHospital = 15 //km
    if (vehicleType == null) {
        vehicleType = 'sedan';
    }

    return new Promise(function (resolve, reject) {
        getHospitalStayDuration(procedureName, function (duration) {
            resolve(duration[0].treatmentList.minHospitalization)
        })
    })
    .then(function (duration) {

        return new Promise(function (resolve, reject) {

            transportModel.aggregate([
                {
                    "$match": { "$and": [{ "serviceActiveFlag": "Y" }, { "vehicle.vehicleType": vehicleType }, { "vehicle.activeFlag": 'Y' }] }
                }, 
                {
                    $unwind: "$vehicle" },
                {
                    "$project": {
                        "_id": 0,
                        "dailyTransportationCost": {
                            "$cond": {
                                "if": {
                                    "$eq": ["$vehicle.currency", 'INR']
                                },
                                "then": {
                                    $ceil: {
                                        $divide: [{
                                            $sum: [
                                                { $multiply: [{ "$avg": "$vehicle.chargePerKiloMeter" }, (distanceToHospital * 2 * 2) ] },
                                            ]
                                        }, dollerRate]
                                    }

                                },
                                "else": {
                                    $sum: [
                                        { $multiply: [{ "$avg": "$vehicle.chargePerKiloMeter" }, (distanceToHospital * 2 * 2)] },
                                    ]
                                }
                            }
                        }, "totalTransportationCost": {
                            "$cond": {
                                "if": {
                                    "$eq": ["$vehicle.currency", 'INR']
                                },
                                "then": {
                                    $ceil: {
                                        $divide: [{
                                            $sum: [
                                                { $multiply: [{ "$avg": "$vehicle.chargePerKiloMeter" }, (distanceToHospital * 2 * 2) * duration] },
                                            ]
                                        }, dollerRate]
                                    }

                                },
                                "else": {
                                    $sum: [
                                        { $multiply: [{ "$avg": "$vehicle.chargePerKiloMeter" }, (distanceToHospital * 2 * 2) * duration] },
                                    ]
                                }
                            }
                        }
                    }
                }
            ], function (err, result) {

                if (err) {
                    logger.error("Error while reading transportation cost from from DB");
                    resolve(JSON.parse(JSON.stringify([{ "totalTransportationCost": 0 }])));
                } else if (!result.length) {
                    logger.info("There are no active transportation details present in database");
                    resolve(JSON.parse(JSON.stringify([{ "totalTransportationCost": 0 }])));
                }
                else {                    
                    resolve(JSON.parse(JSON.stringify(result)))
                }
            })

        })
    })
}

/* Get cost of evisa */
var geteVisaCost = function (req, res) {

    if (res.headersSent) {//check if header is already returned
        logger.warn("Response already sent.Hence skipping the function call geteVisaCost")
        return;
    }
  
    return new Promise(function (resolve, reject) {
        var country = req.query.countryName
        evisaCost.getevisaDetails(country, function (visaCost) {
            resolve(visaCost)
        })
    })
        
}


