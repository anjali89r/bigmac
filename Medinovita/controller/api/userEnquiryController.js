var mongoose = require('mongoose');
var Promise = require('promise');
var logger = require('../utilities/logger.js');
require('../../model/userEnquirymodel.js');
var userEnquiryModel = mongoose.model('user_enquiry');

var userEnquirySchema = new userEnquiryModel();

/************************ API code to submit new enquiry to Medinovita ****************************/
module.exports.submitUserEnquiry = function (req, res) {

    new Promise(function (resolve, reject) {

        userEnquiryModel.findOne({ "emailID": req.body["emailID"] }, function (err, doc) {
            if (doc == null) { /* If it's the first enquiry from user*/
                userEnquirySchema.emailID = req.body["emailID"],
                    userEnquirySchema.enquiry = {
                        userFullName: req.body["userFullName"],
                        isdCode: parseInt(req.body["isdCode"]),
                        primaryPhonenumber: parseInt(req.body["primaryPhonenumber"]),
                        procedureName: req.body["procedureName"],
                        commuMedium: req.body["commuMedium"],
                        caseDescription: req.body["caseDescription"],
                        attachmentFlag: req.body["attachment"],
                        attachmentName: req.body["attachmentName"],
                        response: []
                    }
                resolve()

            } else {  /* Update if atlest one query is present for the same user*/

                userEnquiryModel.findOneAndUpdate({ "emailID": req.body["emailID"] },
                    {
                        "$push": {
                            "enquiry": {
                                "userFullName": req.body["userFullName"],
                                "isdCode": parseInt(req.body["isdCode"]),
                                "primaryPhonenumber": parseInt(req.body["primaryPhonenumber"]),
                                "procedureName": req.body["procedureName"],
                                "commuMedium": req.body["commuMedium"],
                                "caseDescription": req.body["caseDescription"],
                                "attachmentFlag": req.body["attachment"],
                                "attachmentName": req.body["attachmentName"],
                                "response": []
                            }
                        }
                    },
                    { returnOriginal: false, upsert: true }, function (err, doc) {
                        if (err) {
                            logger.error("Error while updating record : - " + err.message);
                            return reject(res.status(409).json({
                                "Message": "Error while saving enquiry for user " + req.body['emailID'] + " in user enquiry collection"
                            }));
                        } else if (doc === null) {
                            logger.error("Error while updating record : - unable to update database");
                            return reject(res.status(409).json({
                                "Message": "Error while saving enquiry for user " + req.body['emailID'] + " due to " + err.message
                            }));
                        }
                        resolve();
                    });
            }
        })
    })
    .then(function () {
        userEnquirySchema.save(function (error, data) {
            if (error) {
                logger.error("Error while inserting record in user enquiry collection: - " + error.message)
                return res.status(500).json({ "Message": error.message.trim() });
            }
            else {
                return res.json({ "Message": "Data got inserted successfully" });
            }
        })
    })
        .catch(function (err) {
            logger.error("Error while inserting record in : - " + err.message)
            return res.status(500).json({ "Message": err.message });
        })
}

/************************ API code to send response to email ****************************/
module.exports.sendEnquiryResponse = function (req, res) {

    var userEmailID = req.params.userEmail;
    var enquiryID = req.params.enquiryID;

    //Create dbcheck promise
    new Promise(function (resolve, reject) {
        userEnquiryModel.findOne({ "emailID": userEmailID, "enquiry": { $elemMatch: { "enquiryCode": enquiryID } } }, function (err, doc) {
             if (doc == null) {
                 logger.info("Enquiry for user  " + userEmailID + " with query id " + enquiryID + " does not exists in database");
                 return reject(res.status(409).json({
                     "Message": "Enquiry for user  " + userEmailID + " with query id " + enquiryID + " does not exists in database"
                 }));
             }
             resolve();
         });
    }).then(function () {
        userEnquiryModel.findOneAndUpdate({ "emailID": userEmailID, "enquiry": { $elemMatch: { "enquiryCode": enquiryID } }},
            {
                "$push": {
                    "enquiry.$.response": {
                        "mediNovitaResponse": req.body["mediNovitaResponse"],
                        "respondedBy": req.body["respondedBy"],
                        "contactedMethod": req.body["contactedMethod"],
                        "emailResponseSent": req.body["emailResponseSent"],
                        "nextFollowUpDate": req.body["followupDate"],
                        "followUpAssignee": req.body["followupAssignee"],
                        "followUpNote": req.body["followupNote"],
                    }
                }
            },
            { returnOriginal: false, upsert: true }, function (err, doc) {
                if (err) {
                    logger.error("Error while updating record : - " + err.message);
                    return res.status(409).json({
                        "Message": "Error while saving response for user " + userEmailID + " enquiry in user enquiry collection"
                    });
                } else if (doc === null) {
                    logger.error("Error while updating record : - unable to update database");
                    return res.status(409).json({
                        "Message": "Error while saving response for user " + userEmailID + " enquiry in user enquiry collection " + err.message
                    });
                }                
            });

    }).then(function () {
        userEnquirySchema.save(function (error, data) {
            if (error) {
                logger.error("Error while inserting record in user enquiry collection: - " + error.message)
                return res.status(500).json({ "Message": error.message.trim() });
            }
            else {
                return res.json({ "Message": "Data got inserted successfully" });
            }
        })

    })
    .catch(function (err) {
        logger.error("Error while inserting record in : - " + err.message)
        return res.status(500).json({ "Message": err.message });
    })
}

