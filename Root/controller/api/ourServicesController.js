var mongoose = require('mongoose');
var Promise = require('promise');
var logger = require('../utilities/logger.js');
require('../../model/ourServicesModel.js');
var ourServicesModel = mongoose.model('services_collection');

module.exports.addServicedetails = function (req, res) {

    if (res.headersSent) {//check if header is already returned
        logger.warn("Response already sent.Hence skipping the function call addServicedetails")
        return;
    }

    var ourServicesSchema = new ourServicesModel();

    new Promise(function (resolve, reject) {
           /* Initial Validation */
        if (req.body["serviceName"] == null || req.body["serviceShortform"] == null || req.body["serviceDescription"] == null || req.body["isDisable"] == null ) {
                logger.error("Mandatory fields are not passed in the request. Please correct request");
                return reject(res.status(400).json({
                    "Message": "Mandatory fields are missing in the request"
                }));
            }          
        ourServicesSchema.serviceName = req.body["serviceName"],
            ourServicesSchema.serviceShortform = req.body["serviceShortform"].toUpperCase(),
            
            ourServicesSchema.serviceDescription = req.body["serviceDescription"],
            
            ourServicesSchema.isDisable = req.body["isDisable"]
                    resolve();           
            })
        .then(function () {
            ourServicesSchema.save(function (error, data) {
                if (error) {
                    logger.error("Error saving services details data to schema : - " + error.message)
                    return res.status(500).json({ "Message": error.message.trim() });
                }
                else {
                    return res.status(201).json({ "Message": "Service details are updated to DB" });
                }
            })
        })
        .catch(function (err) {
            logger.error("Error while inserting service details to schema: - " + err.message)
            return res.status(500).json({ "Message": err.message });
        })

}

module.exports.getServicesSection = function (req, res) {

    if (res.headersSent) {//check if header is already returned
        logger.warn("Response already sent.Hence skipping the function call get service section")
        return;
    }

    var ourServicesSchema = new ourServicesModel();

    ourServicesModel.aggregate([
        { "$match": { "isDisable": "N", "serviceShortform": req.params.serviceShortname.toUpperCase() } },
        { "$project": { "_id": 0, "serviceName": 1, "serviceShortform": 1, "serviceDescription": 1} }
        
    ], function (err, result) {

        if (err) {
            logger.error("Error while reading service section from DB");
            return res.status(500).json({ "Message": err.message.trim() });
        } else if (result == null) {
            logger.info("There is no service section description available");
            return res.status(400).json({ "Message": err.message.trim() });
        }
        else {
            return res.json(result);
        }
    })
}