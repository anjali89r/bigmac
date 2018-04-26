var mongoose = require('mongoose');
var Promise = require('promise');
var logger = require('../utilities/logger.js');
require('../../model/localTransportModel.js');
var transportModel = mongoose.model('local_transport_details');
var counterSchema = require('../../model/identityCounterModel.js');

var collection = 'local_transport_details';

/* API to add new transport vendor details */
module.exports.addLocalTransportVendorDtls = function (req, res) {

    if (res.headersSent) {//check if header is already returned
        logger.warn("Response already sent.Hence skipping the function call addLocalTransportVendorDtls")
        return;
    }

    var transportSchema = new transportModel();

    new Promise(function (resolve, reject) {

        transportModel.findOne({
            "name": req.body['providerName'], "contact.postalCode": parseInt(req.body['postalCode'])
        }, function (err, doc) {
            if (doc != null) {
                logger.warn("Transport provider with name " + req.body['providerName'] + " already exists in database");
                return reject(res.status(409).json({ "Message": "Transport provider with name " + req.body['providerName'] + " already exists in database" }));
            } else {
                counterSchema.getNext('transportProviderId', collection, function (id) {
                    providerId = id;
                    resolve(providerId);
                })
            }
        })
    }).then(function (providerId) {

         transportSchema.providerID = providerId,
         transportSchema.name = req.body['providerName'],

         transportSchema.contact.addressLine1 = req.body['addressLine1'],
         transportSchema.contact.addressLine2=  req.body['addressLine2'],
         transportSchema.contact.city= req.body['city'],
         transportSchema.contact.postalCode = req.body['postalCode'],
         transportSchema.contact.residingcountry = req.body['country'],
         transportSchema.contact.landmark = req.body['landmark'],
         transportSchema.contact.contactPerson = req.body['contactPerson'],
         transportSchema.contact.contactEmailId = req.body['contactEmailId'],
         transportSchema.contact.primaryContactNumber = req.body['primaryContactNumber']
         if (req.body['secondaryContactNumber'].toString().trim().length == 10) {
            transportSchema.contact.secondaryContactNumber = req.body['secondaryContactNumber']
         } 
         transportSchema.serviceActiveFlag = req.body['serviceActiveFlag'],
  
         transportSchema.vehicle= [{
            vehicleType: req.body['vehicleType'],
            minimumChargeforDayUse: req.body['minimumChargeforDayUse'],
            noAdditionalChargesUpToKM: req.body['noAdditionalChargesUpToKM'],
            chargePerKiloMeter: req.body['chargePerKiloMeter'],
            selfDriven: req.body['selfDriven'],
            additionalChargesPerKiloMeter: req.body['additionalChargesPerKiloMeter'],
            minimumDriverBata: req.body['minimumDriverBata'],
            driverBataPerKiloMeter: req.body['driverBataPerKiloMeter'],
            activeFlag: req.body['activeFlag'],
            currency: req.body['currency'],
            }]


    }).then(function () {

        transportSchema.save(function (error) {
            if (error) {
                logger.error("Error while inserting record in transport details collection: - " + error.message)
                return res.status(500).json({ "Message": error.message.trim() });
            }
            else {
                return res.status(201).json({ "Message": "Data got inserted successfully in local_transport_details collection" });
            }
        })

    })
    .catch(function (err) {
        return res.status(500).json({ "Message": err.message });
    });
}

/* API to update transport vendor details */
module.exports.updateLocalTransportVendorDtls = function (req, res) {

    if (res.headersSent) {//check if header is already returned
        logger.warn("Response already sent.Hence skipping the function call updateLocalTransportVendorDtls")
        return;
    }

    var transportSchema = new transportModel();

    new Promise(function (resolve, reject) {

        checkForNewVehicleType(req, function (doc) {
            resolve(doc)
        })
    })
    .then(function (doc) {

        var updateJustServiceDtls = doc.split(/\|/)[2];
        var updateVehicle = doc.split(/\|/)[1];
        var addVehicle = doc.split(/\|/)[0];

        if (updateJustServiceDtls == 'true') { /* To update service details for the same vendor */ 
            return updateJustServiceDetailsOnly(req, res)           
        } else if (updateVehicle == 'true') { /* To update vehicle details for the same vendor */ 
            return updateJustVehicleDetailsOnly(req, res)  
        } else if (addVehicle == 'true') { /* To add new vehicle details for the same vendor */
            return addJustNewVehicleDetailsOnly(req, res)
        }
        }).then(function () {
            /*transportSchema.save(function (error) {
                if (error) {
                    logger.error("Error while updating record in transport details collection: - " + error.message)
                    return res.status(500).json({ "Message": error.message.trim() });
                } else {
                    return res.status(200).json({
                        "Message": "Data got updated successfully in transport details collection" });
                }
            }) */

        }).catch(function (err) {
           return res.status(500).json({ "Message": err.message });
    });
}

/* check whether update request is to update vehicle details or add new vehicle */
function checkForNewVehicleType(req, next) {

    var updateVehicle = false;
    var addVehicle = false;

    var updateJustServiceDtls = false
    if (req.body['vehicleType'] == null) {
        updateJustServiceDtls = true     
        next(addVehicle + "|" + updateVehicle + "|" + updateJustServiceDtls)
    }
    transportModel.findOne({
        "name": req.body['providerName'], "contact.postalCode": parseInt(req.body['postalCode']), "vehicle": { $elemMatch: { "vehicleType": req.body['vehicleType'] } }
    }, function (err, doc) {
        if (doc == null) {
            /* check for vehicle */
            transportModel.findOne({
                "name": req.body['providerName'], "contact.postalCode": parseInt(req.body['postalCode'])                
            }, function (err, doc) {
                if (doc == null) {
                    next(false + "|" + false + "|" + false)
                } else {
                    next(true + "|" + false + "|" + false)
                }
            })
        } else {
            next(false + "|" + true + "|" + false)
        }
    })

}
/* This function is used to update just service details for the same vendor */
var updateJustVehicleDetailsOnly = function (req, res) {

    var promise = new Promise(function (resolve, reject) {

        transportModel.findOneAndUpdate({ "name": req.body['providerName'], "contact.postalCode": parseInt(req.body['postalCode']), "vehicle": { $elemMatch: { "vehicleType": req.body['vehicleType'] } } },
            {
                $set: {
                    "contact.addressLine1": req.body['addressLine1'],
                    "contact.addressLine2": req.body['addressLine2'],
                    "contact.city": req.body['city'],
                    "contact.postalCode": req.body['postalCode'],
                    "contact.residingcountry": req.body['country'],
                    "contact.landmark": req.body['landmark'],
                    "contact.contactPerson": req.body['contactPerson'],
                    "contact.contactEmailId": req.body['contactEmailId'],
                    "contact.primaryContactNumber": req.body['primaryContactNumber'],
                    "contact.secondaryContactNumber": req.body['secondaryContactNumber'],
                    "serviceActiveFlag": req.body['serviceActiveFlag'],
                    //update array
                    "vehicle.$.vehicleType": req.body['vehicleType'],
                    "vehicle.$.minimumChargeforDayUse": req.body['minimumChargeforDayUse'],
                    "vehicle.$.noAdditionalChargesUpToKM": req.body['noAdditionalChargesUpToKM'],
                    "vehicle.$.chargePerKiloMeter": req.body['chargePerKiloMeter'],
                    "vehicle.$.selfDriven": req.body['selfDriven'],
                    "vehicle.$.additionalChargesPerKiloMeter": req.body['additionalChargesPerKiloMeter'],
                    "vehicle.$.minimumDriverBata": req.body['minimumDriverBata'],
                    "vehicle.$.driverBataPerKiloMeter": req.body['driverBataPerKiloMeter'],
                    "vehicle.$.activeFlag": req.body['activeFlag'],
                    "vehicle.$.currency": req.body['currency']

                }
            }, { new: true },
            function (err, doc) {
                if (err) {
                    logger.error("Error while updating record : - " + err.message);
                    return reject(res.status(409).json({
                        "Message": "Error while updating transport details for provider " + req.body['providerName'] + " in transport details table"
                    }));
                } else if (doc === null) {
                    logger.error("Error while updating record in transport details : - unable to update database");
                    return reject(res.status(409).json({
                        "Message": "Error while updating transport details for provider " + req.body['providerName'] + " due to " + err.message
                    }));
                } else {
                    //save document
                    doc.save()
                    return resolve(res.status(202).json({
                        "Message": "Data got updated successfully in transport details collection"
                    }));

                }

            });
    })
    return promise;
}
/* This function is used to add just new vehicle details for the same vendor */
var addJustNewVehicleDetailsOnly = function (req, res) {

    var promise = new Promise(function (resolve, reject) {
        
        transportModel.findOne({ "name": req.body['providerName'], "contact.postalCode": parseInt(req.body['postalCode']) },

             function (err, doc) {
                if (err) {
                    logger.error("Error while updating record : - " + err.message);
                    return reject(res.status(409).json({
                        "Message": "Error while updating transport details for provider " + req.body['providerName'] + " in transport details table"
                    }));
                } else if (doc === null) {
                    logger.error("Error while updating record in transport details : - unable to update database");
                    return reject(res.status(409).json({
                        "Message": "Error while updating transport details for provider " + req.body['providerName'] + " due to " + err.message
                    }));
                } else {

                     doc.contact.addressLine1 = req.body['addressLine1']
                     doc.contact.addressLine2 = req.body['addressLine2']
                     doc.contact.city = req.body['city']
                     doc.contact.postalCode = parseInt(req.body['postalCode'])
                     doc.contact.residingcountry = req.body['country']
                     doc.contact.landmark = req.body['landmark']
                     doc.contact.contactPerson = req.body['contactPerson']
                     doc.contact.contactEmailId = req.body['contactEmailId']
                     doc.contact.primaryContactNumber = parseInt(req.body['primaryContactNumber'])
                     doc.contact.secondaryContactNumber = req.body['secondaryContactNumber']
                     doc.serviceActiveFlag = req.body['serviceActiveFlag']
                     doc.vehicle.push({
                        "vehicleType": req.body['vehicleType'],
                        "minimumChargeforDayUse": req.body['minimumChargeforDayUse'],
                        "noAdditionalChargesUpToKM": req.body['noAdditionalChargesUpToKM'],
                        "chargePerKiloMeter": req.body['chargePerKiloMeter'],
                        "selfDriven": req.body['selfDriven'],
                        "additionalChargesPerKiloMeter": req.body['additionalChargesPerKiloMeter'],
                        "minimumDriverBata": req.body['minimumDriverBata'],
                        "driverBataPerKiloMeter": req.body['driverBataPerKiloMeter'],
                        "activeFlag": req.body['activeFlag'],
                        "currency": req.body['currency']
                     })
                     //save document
                     doc.save()

                     return resolve(res.status(201).json({
                         "Message": "Data got updated successfully in transport details collection"
                     }));
                 }                        
            });

    })
    return promise;
}

/* This function is used to update just service details for the same vendor */
var updateJustServiceDetailsOnly = function (req, res) {
    var promise = new Promise(function (resolve, reject) {
        transportModel.findOne({ "name": req.body['providerName'], "contact.postalCode": parseInt(req.body['postalCode']) },function (err, doc) {
                if (err) {
                    logger.error("Error while updating record : - " + err.message);
                    return reject(res.status(409).json({
                        "Message": "Error while updating transport details for provider " + req.body['providerName'] + " in transport details table"
                    }));
                } else if (doc === null) {
                    logger.error("Error while updating record in transport details : - unable to update database");
                    return reject(res.status(409).json({
                        "Message": "Error while updating transport details for provider " + req.body['providerName'] + " due to " + err.message
                    }));
                } else {

                    doc.contact.addressLine1= req.body['addressLine1']
                    doc.contact.addressLine2= req.body['addressLine2']
                    doc.contact.city= req.body['city']
                    doc.contact.postalCode= req.body['postalCode']
                    doc.contact.residingcountry = req.body['country']
                    doc.contact.landmark= req.body['landmark']
                    doc.contact.contactPerson=req.body['contactPerson']
                    doc.contact.contactEmailId= req.body['contactEmailId']
                    doc.contact.primaryContactNumber= req.body['primaryContactNumber']
                    doc.contact.secondaryContactNumber= req.body['secondaryContactNumber']
                    doc.serviceActiveFlag = req.body['serviceActiveFlag']                      
                    //save document
                    doc.save()

                    return resolve(res.status(202).json({
                        "Message": "Data got updated successfully in transport details collection"
                    }));     
                }                
            });
    })
    return promise;
}

/* API to get list of active transportation vendor details */
module.exports.getActiveTransportVendorDtls = function (req, res) {

    if (res.headersSent) {//check if header is already returned
        logger.warn("Response already sent.Hence skipping the function call getActiveTransportVendorDtls")
        return;
    }
    transportModel.aggregate([
        {
            "$match": { "serviceActiveFlag": "Y" }
        },    
        {
        "$project": {
            "_id": 0,
            "name" : 1,
            "contact.addressLine1": 1,
            "contact.addressLine2": 1,
            "contact.city": 1,
            "contact.postalCode": 1,
            "contact.residingcountry": 1,
            "contact.landmark": 1,
            "contact.contactPerson":1,
            "contact.contactEmailId": 1,
            "contact.primaryContactNumber": 1,
            "contact.secondaryContactNumber": 1,
            //filter vehicle array
            "vehicle": {
                "$setDifference": [
                    {
                        "$map": {
                            "input": "$vehicle",
                            "as": "vehicle",
                            "in": {
                                "$cond": [//specify the filter here
                                    {
                                        "$eq": ["$$vehicle.activeFlag", "Y"] },                                    
                                    //},
                                    {       
                                        "vehicleType": "$$vehicle.vehicleType",
                                        "chargePerKiloMeter": "$$vehicle.chargePerKiloMeter",
                                        "minimumChargeforDayUse": "$$vehicle.minimumChargeforDayUse",
                                        "noAdditionalChargesUpToKM": "$$vehicle.noAdditionalChargesUpToKM",  
                                        "chargePerKiloMeter": "$$vehicle.chargePerKiloMeter",
                                        "selfDriven": "$$vehicle.selfDriven", 
                                        "additionalChargesPerKiloMeter": "$$vehicle.additionalChargesPerKiloMeter",  
                                        "minimumDriverBata": "$$vehicle.minimumDriverBata",
                                        "driverBataPerKiloMeter": "$$vehicle.driverBataPerKiloMeter", 
                                        "activeFlag": "$$vehicle.activeFlag", 
                                        "currency": "$$vehicle.currency",                                
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
            logger.error("Error while reading transportation details from from DB");
            return res.status(500).json({ "Message": err.message.trim() });
        } else if (!result.length) {
            logger.info("There are no active transportation vendors present in database");
            return res.status(400).json({ "Message": "There are no active transportation vendors present in database" });
        }
        else {
            return res.status(200).json(result);
        }
    })
}