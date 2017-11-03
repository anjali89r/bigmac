var mongoose = require('mongoose');
var Promise = require('promise');
var logger = require('../utilities/logger.js');
require('../../model/contactUsModel.js');

var contactusModel = mongoose.model('contactus');

/************************ API code to submit contact us to Medinovita ****************************/
module.exports.submitContact = function (req, res) {

    if (res.headersSent) {//check if header is already returned
        logger.warn("Response already sent.Hence skipping the function call submitUserEnquiry")
        return;
    }  

    var contactusSchema = new contactusModel();

    new Promise(function (resolve, reject) {

        contactusModel.findOne({ "emailID": req.body["emailID"]}, function (err, doc) {
            if (doc == null) { /* If it's the first enquiry from user*/
                                 contactusSchema.emailID = req.body["emailID"],
                                 contactusSchema.userFullName = req.body["userFullName"],
                                 contactusSchema.enquiry =
                                     {
                                        subject: req.body["subject"],
                                        message: req.body["message"],
                                        updated_at: new Date() 
                                     }   
                    
                                resolve()

            } else {  /* Update if atlest one query is present for the same user*/

                contactusModel.findOneAndUpdate({ "emailID": req.body["emailID"]},
                    {
                        "$push": {
                            "enquiry": {
                                "subject": req.body["subject"],
                                "message": req.body["message"],
                                "updated_at": new Date()
                               
                            }
                        }
                    },
                    { new: true }, function (err, doc) {
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
                        }
                        resolve();
                    });
            }
        })
    })
    .then(function () {
        contactusSchema.save(function (error, data) {
            if (error) {
                logger.error("Error while inserting record in user enquiry collection: - " + error.message)
                return res.status(500).json({ "Message": error.message.trim() });
            }
            else {
                return res.json({ "Message": "Thank you for contacting,we will get back to you soon" });
            }
        })
    })
    .catch(function (err) {
        logger.error("Error while inserting record in : - " + err.message)
        return res.status(500).json({ "Message": err.message });
    })
}

