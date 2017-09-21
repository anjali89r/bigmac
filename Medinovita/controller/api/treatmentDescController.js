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
        if (req.body["treatmentName"] == null || req.body["displayImagepath"] == null || req.body["procedureName"] == null || req.body["shortDescription"] == null || req.body["treatmentDescription"] == null || req.body["hospitalStay"] == null || req.body["healingTime"] == null || req.body["isDisable"] == null ) {
                logger.error("Mandatory fields are not passed in the request. Please correct request");
                return reject(res.status(400).json({
                    "Message": "Mandatory fields are missing in the request"
                }));
            }          
        treatmentDescSchema.treatmentName = req.body["treatmentName"].toUpperCase(),
            treatmentDescSchema.procedureName = req.body["procedureName"].toUpperCase(),
            
            treatmentDescSchema.displayImagepath = req.body["displayImagepath"],
            treatmentDescSchema.treatmentDescription = req.body["treatmentDescription"],
            treatmentDescSchema.shortDescription = req.body["shortDescription"],
            treatmentDescSchema.hospitalStay = req.body["hospitalStay"],
            treatmentDescSchema.healingTime = req.body["healingTime"],
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
        { "$project": { "_id": 0, "treatmentName": 1,"procedureName":1, "displayImagepath": 1, "treatmentDescription": 1, "shortDescription": 1, "hospitalStay": 1, "healingTime": 1, "surgicalTime": 1, "postFollowupFrequency": 1,"postFollowupDuration":1} }
        
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