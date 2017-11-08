﻿var mongoose = require('mongoose');
var Promise = require('promise');
var logger = require('../utilities/logger.js');
require('../../model/holidayPackageModel.js');
var holidayModel = mongoose.model('holiday_package');
var counterSchema = require('../../model/identityCounterModel.js');

var collection = 'holiday_package';

/* To update new holiday package in database */
module.exports.createHolidayPackage = function (req, res) {

    if (res.headersSent) {//check if header is already returned
        logger.warn("Response already sent.Hence skipping the function call createHolidayPackage")
        return;
    }

    var holidaySchema = new holidayModel();

    new Promise(function (resolve, reject) {

        holidayModel.findOne({
            "packageShortName": req.body['packageShortName'], "tourOperator": req.body['tourOperator']
        }, function (err, doc) {
            if (doc != null) {
                logger.warn("Holiday package " + req.body['packageShortName'] + " already exists in database");
                return reject(res.status(409).json({ "Message": "Holiday package " + req.body['packageShortName']  + " already exists in database" }));
            } else {
                counterSchema.getNext('holidayPackageId', collection, function (id) {
                    holidayPackageId = id;
                    resolve(holidayPackageId);
                })
            }
        })
    }).then(function (holidayPackageId) {
  
        holidaySchema.holidayPackageId = holidayPackageId,   
        holidaySchema.packageShortName = req.body["packageShortName"],
        holidaySchema.packageDescription=req.body["packageDescription"],
        holidaySchema.packageDuration=req.body["packageDuration"],
        holidaySchema.tourOperator = req.body["tourOperator"],
        holidaySchema.website = req.body["operatorWebsite"],
        holidaySchema.packageCost = parseInt(req.body["packageCost"]),
        holidaySchema.activeStatus = req.body["activeStatus"]
        
    }).then(function () {

        holidaySchema.save(function (error) {
            if (error) {
                logger.error("Error while inserting record in holiday collection: - " + error.message)
                return res.status(500).json({ "Message": error.message.trim() });
            }
            else {
                return res.json({ "Message": "Data got inserted successfully in holiday collection" });
            }
        })

    })
    .catch(function (err) {
        return res.json({ "Message": err.message });
    });

}

/*   Update holiday package details */
module.exports.updateHolidayPackage = function (req, res) {

    if (res.headersSent) {//check if header is already returned
        logger.warn("Response already sent.Hence skipping the function call updateHolidayPackage")
        return;
    }

    var holidaySchema = new holidayModel();

    new Promise(function (resolve, reject) {

        if ((req.body['packageShortName'] == null) || (req.body['tourOperator'] == null)) {
            logger.error("Package short name or tour operator name is missing in the request");
            return reject(res.status(409).json({ "Message": "Holiday package name or operator name is missing" }));
        }

        holidayModel.findOneAndUpdate({ "packageShortName": req.body['packageShortName'], "tourOperator": req.body['tourOperator'] },

            {
                "packageShortName" : req.body["packageShortName"],
                "packageDescription" : req.body["packageDescription"],
                "packageDuration" : req.body["packageDuration"],
                "tourOperator" : req.body["tourOperator"],
                "website" : req.body["operatorWebsite"],
                "packageCost": req.body["packageCost"],
                "activeStatus": req.body["activeStatus"]

            }, { returnOriginal: false, upsert: true }, function (err, doc) {
                if (err) {
                    logger.error("Error while updating record : - " + err.message);
                    return reject(res.status(409).json({
                        "Message": "Error while updating holiday details with name " + req.body["packageShortName"] + " in holiday package table"
                    }));
                } else if (doc === null) {
                    logger.error("Error while updating record in holiday package : - unable to update database");
                    return reject(res.status(409).json({
                        "Message": "Error while updating holiday details with name " + req.body["packageShortName"] + " due to " + err.message
                    }));
                } else {
                    resolve();
                }
                
            });

    }).then(function () {
        return res.json({ "Message": "Holiday data got updated successfully" });
    }).catch(function (err) {
        return res.json({ "Message": err.message });
    });
}

/*   Get holiday package details */
module.exports.getHolidayPackageDetails = function (req, res) {

    if (res.headersSent) {//check if header is already returned
        logger.warn("Response already sent.Hence skipping the function call getHolidayPackageDetails")
        return;
    }

    holidayModel.aggregate([{ "$match": { "activeStatus": "Y" } },
    {
        "$project": {
            "_id": 0,
            "packageShortName": 1,
            "packageDescription": 1,
            "packageDuration": 1,
            "tourOperator": 1,
            "website": 1,
            "packageCost": 1
        }
    }
    ], function (err, result) {

        if (err) {
            logger.error("Error while reading holiday packages from from DB");
            return res.status(500).json({ "Message": err.message.trim() });
        } else if (!result.length) {
            logger.info("There are no active holiday packages present in database");
            return res.status(200).json({ "Message": "There are no active holiday packages present in database" });
        }
        else {
            return res.status(200).json(result);
        }
    })

}