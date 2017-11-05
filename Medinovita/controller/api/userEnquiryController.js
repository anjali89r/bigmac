var mongoose = require('mongoose');
var Promise = require('promise');
var logger = require('../utilities/logger.js');
require('../../model/userEnquirymodel.js');
var userEnquiryModel = mongoose.model('user_enquiry');

/************************ API code to submit new enquiry to Medinovita ****************************/
module.exports.submitUserEnquiry = function (req, res) {

    if (res.headersSent) {//check if header is already returned
        logger.warn("Response already sent.Hence skipping the function call submitUserEnquiry")
        return;
    }  

    var userEnquirySchema = new userEnquiryModel();

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
                resolve(true)

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
                    { new: true }, function (err, doc) {
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
                        resolve(false);
                    });
            }
        })
    })
    .then(function (flag) {
        if (flag == true) {//save only for insert and skip for update
            userEnquirySchema.save(function (error, data) {
                if (error) {
                    logger.error("Error while inserting record in user enquiry collection: - " + error.message)
                    return res.status(500).json({ "Message": error.message.trim() });
                }
                else {
                    return res.json({ "Message": "Data got inserted successfully" });
                }
            })
        }
    })
    .catch(function (err) {
        logger.error("Error while inserting record in : - " + err.message)
        return res.status(500).json({ "Message": err.message });
    })
}

/************************ API code to send response to email ****************************/
module.exports.sendEnquiryResponse = function (req, res) {

    if (res.headersSent) {//check if header is already returned
        logger.warn("Response already sent.Hence skipping the function call sendEnquiryResponse")
        return;
    }  

    var userEnquirySchema = new userEnquiryModel();

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

/************************ API code to get un answered queries ****************************/
module.exports.getPendingEnquiryResponse = function (req, res) {

    if (res.headersSent) {//check if header is already returned
        logger.warn("Response already sent.Hence skipping the function call getPendingEnquiryResponse")
        return;
    }  

    userEnquiryModel.aggregate([
    {
        "$match": {
            response: { $exists: false, $ne: [] }
        }
    },
    {
    "$project": {
        "_id": 0,
        "emailID": 1,
        "enquiry": {
            "$setDifference": [
                {
                    "$map": {
                        "input": "$enquiry",
                        "as": "enquiry",
                        "in": {
                            "$cond": [//specify the filter here
                                {
                                  // "$eq": ["$$enquiry.userFullName", "Libin Sebastian new"] },                                    
                                },
                                { "userFullName": "$$enquiry.userFullName", "primaryPhonenumber": "$$enquiry.primaryPhonenumber", "caseDescription": "$$enquiry.caseDescription"},
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
        logger.error("Error while reading list of enquiries where response is required");
        return res.status(500).json({ "Message": err.message.trim() });
    } else if (result == null) {
        logger.info("There are no enquiries where response is due");
        return res.status(200).json({ "Message": err.message.trim() });
    }
    else {
        return res.json(result);
    }
  })

}

