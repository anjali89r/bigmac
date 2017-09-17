var mongoose = require('mongoose');
var Promise = require('promise');
var logger = require('../utilities/logger.js');
require('../../model/treatmentsDescModel.js');
var treatmentDescModel = mongoose.model('treatmentOffered_description');

module.exports.addtreatmentDescription = function (req, res) {

    if (res.headersSent) {//check if header is already returned
        logger.warn("Response already sent.Hence skipping the function call addtreatmentdescription")
        return;
    }

    var treatmentDescSchema = new treatmentDescModel();

    new Promise(function (resolve, reject) {
           /* Initial Validation */
        if (req.body["treatmentName"] == null || req.body["displayName"] == null || req.body["treatmentDescription"] == null || req.body["minHospitalization"] == null || req.body["maxHospitalization"] == null || req.body["surgicalTime"] == null || req.body["postFollowupDuration"] == null || req.body["postFollowupFrequency"] == null || req.body["isDisable"] == null ) {
                logger.error("Mandatory fields are not passed in the request. Please correct request");
                return reject(res.status(409).json({
                    "Message": "Mandatory fields are missing in the request"
                }));
            }          
        treatmentDescSchema.treatmentName = req.body["treatmentName"].toUpperCase(),
            treatmentDescSchema.displayName = req.body["displayName"],
            treatmentDescSchema.treatmentDescription = req.body["treatmentDescription"],
            treatmentDescSchema.minHospitalization = req.body["minHospitalization"],
            treatmentDescSchema.maxHospitalization = req.body["maxHospitalization"],
            treatmentDescSchema.surgicalTime = req.body["surgicalTime"],
            treatmentDescSchema.postFollowupDuration = req.body["postFollowupDuration"],
            treatmentDescSchema.postFollowupFrequency = req.body["postFollowupFrequency"]
            treatmentDescSchema.isDisable = req.body["isDisable"]
                    resolve();           
            })
        .then(function () {
            treatmentDescSchema.save(function (error, data) {
                if (error) {
                    logger.error("Error saving treatments data to schema : - " + error.message)
                    return res.status(500).json({ "Message": error.message.trim() });
                }
                else {
                    return res.json({ "Message": "Treatment description was updated to DB" });
                }
            })
        })
        .catch(function (err) {
            logger.error("Error while inserting treatments data to schema: - " + err.message)
            return res.status(500).json({ "Message": err.message });
        })

}

module.exports.getTreatmentSection = function (req, res) {

    if (res.headersSent) {//check if header is already returned
        logger.warn("Response already sent.Hence skipping the function call get newsSection")
        return;
    }

    var treatmentDescSchema = new treatmentDescModel();

    treatmentDescModel.aggregate([
        { "$match": { "isDisable": "N", "treatmentName": req.params.treatmentName.toUpperCase() } },
        { "$project": { "_id": 0, "treatmentName": 1, "displayName": 1, "treatmentDescription": 1, "minHospitalization": 1, "maxHospitalization": 1, "surgicalTime": 1, "postFollowupDuration": 1, "postFollowupFrequency": 1} }
        
    ], function (err, result) {

        if (err) {
            logger.error("Error while reading treatment description from DB");
            return res.status(500).json({ "Message": err.message.trim() });
        } else if (result == null) {
            logger.info("There is no treatment description available for the treatment");
            return res.status(200).json({ "Message": err.message.trim() });
        }
        else {
            return res.json(result);
        }
    })
}