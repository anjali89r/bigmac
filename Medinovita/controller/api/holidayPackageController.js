var mongoose = require('mongoose');
var Promise = require('promise');
var logger = require('../utilities/logger.js');
require('../../model/holidayPackageModel.js');
var holidayModel = mongoose.model('holiday_package');
var counterSchema = require('../../model/identityCounterModel.js');

var collection = 'holiday_package';


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
                    console.log("holidayPackageId 1 " + holidayPackageId)
                })
            }
        })
    }).then(function (holidayPackageId) {
        console.log("holidayPackageId 2 " + holidayPackageId)
        holidaySchema.holidayPackageId = holidayPackageId,   
        holidaySchema.packageShortName = req.body["packageShortName"],
        holidaySchema.packageDescription=(req.body["packageDescription"]),
        holidaySchema.packageDuration= parseInt(req.body["packageDuration"]),
        holidaySchema.tourOperator = req.body["tourOperator"],
        holidaySchema.website = req.body["operatorWebsite"],
        holidaySchema.packageCost = req.body["packageCost"] 
        
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