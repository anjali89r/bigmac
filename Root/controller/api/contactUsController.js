var mongoose = require('mongoose');
var Promise = require('promise');
var logger = require('../utilities/logger.js');
require('../../model/contactUsModel.js');
var autoMail=require('./emailController.js');


var contactusModel = mongoose.model('contactus');

/************************ API code to submit contact us to Medinovita ****************************/
module.exports.submitContact = function (req, res) {

    if (res.headersSent) {//check if header is already returned
        logger.warn("Response already sent.Hence skipping the function call submitUserEnquiry")
        return;
    }  

    var contactusSchema = new contactusModel();

    new Promise(function (resolve, reject) {

        var sendTO = req.body["emailID"]
        var subject = "Dear " + req.body["userFullName"] + " - Thank you for contacting Medinovita.We will get back to you soon"
        var emailBody = "Hi " + req.body["userFullName"] + "," + "\r\n" + "\r\n" + "Greetings of the day.This is to acknowledge that we have received your enquiry.We are working on your enquiry and revert back within two working days." + "\r\n" + "\r\n"
            + "Thank you for showing interest in Medinovita." + "\r\n" + "\r\n" + "Message from User - " + req.body["message"] + "\r\n" + "\r\n" + "Thanks & Regards" + "\r\n" + "Medinovita customer care team"

        autoMail.sendEmail(sendTO, subject, emailBody,false, function (callback){})

        contactusModel.findOne({ "emailID": req.body["emailID"]}, function (err, doc) {
            if (doc == null) { /* If it's the first enquiry from user*/
                contactusSchema.emailID = req.body["emailID"],
                    contactusSchema.userFullName = req.body["userFullName"],
                    contactusSchema.enquiry =
                    [{
                        subject: req.body["subject"],
                        message: req.body["message"]
                    }]
                    resolve(true)

            } else {  /* Update if atlest one query is present for the same user*/
                contactusModel.findOneAndUpdate({ "emailID": req.body["emailID"]},
                    {
                        "$set": {
                            "userFullName": req.body["userFullName"], "emailID": req.body["emailID"]},                    
                        "$push": {
                            "enquiry": {
                                "subject": req.body["subject"],
                                "message": req.body["message"],                                                               
                            }
                        }
                    },
                    { safe: true, upsert: true, new: true }, function (err, doc) {
                        if (err) {
                            logger.error("Error while updating record : - " + err.message);
                            return reject(res.status(400).json({
                                "Message": "Error while saving enquiry for user " + req.body['emailID'] + " in user enquiry collection"
                            }));
                        } else if (doc === null) {
                            logger.error("Error while updating record : - unable to update database");
                            return reject(res.status(400).json({
                                "Message": "Error while saving enquiry for user " + req.body['emailID'] + " due to " + err.message
                            }));
                        } else {
                            resolve(false);                           
                        }
                    });
            }
        })
    }).then(function (flag) {

        if (flag == true) {//Skip save when same user send request for second time or more due to defect in mongoose
            contactusSchema.save(function (error, data) {
                if (error) {
                    logger.error("Error while inserting record in user enquiry collection: - " + error.message)
                    return res.status(500).json({ "Message": error.message.trim() });
                }
                else {
                    return res.status(201).json({ "Message": "Thank you for contacting,we will get back to you soon" });
                }
            })
        } else {        
            return res.status(201).json({ "Message": "Thank you for contacting,we will get back to you soon" });
        }
    })
    .catch(function (err) {
        logger.error("Error while inserting record in : - " + err.message)
        return res.status(500).json({ "Message": err.message });
    })
}

