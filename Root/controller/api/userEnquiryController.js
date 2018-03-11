var mongoose = require('mongoose');
var Promise = require('promise');
var logger = require('../utilities/logger.js');
require('../../model/userEnquirymodel.js');
var autoMail = require('./emailController.js');
var userEnquiryModel = mongoose.model('user_enquiry');

/************************ API code to submit new enquiry to Medinovita ****************************/
module.exports.submitUserEnquiry = function (req, res) {

    if (res.headersSent) {//check if header is already returned
        logger.warn('Response already sent.Hence skipping the function call submitUserEnquiry')
        return;
    }

    var userEnquirySchema = new userEnquiryModel();

    new Promise(function (resolve, reject) {

        var sendTO = req.body.emailID
        var subject = 'Dear ' + req.body.userFullName + ' - Thank you for your enquiry'
        var emailBody = 'Dear ' + req.body.userFullName + ',' + '\r\n' + '\r\n' + 'Greetings of the day.This is to acknowledge that we have received your enquiry.We are working on your enquiry and revert back within two working days.' + '\r\n' + '\r\n'
            + 'Thank you for showing interest in Medinovita.' + '\r\n' + '\r\n' + 'Message from User - ' + req.body.caseDescription + '\r\n' + '\r\n' + 'Thanks & Regards' + '\r\n' + 'Medinovita customer care team'

        autoMail.sendEmail(sendTO, subject, emailBody, false, function (callback) { })

        userEnquiryModel.findOne({ emailID: req.body.emailID }, function (err, doc) {
            if (err)
            {
                logger.error('Error while inserting record in user enquiry collection: - ' + error.message)
                return reject(res.status(500).json({
                    Message: 'We apologize for an unexpected error. The enquiry is recieved and we will reach out to you in less than 48hrs '}));
            }
            else if (doc === null) { /* If it's the first enquiry from user*/
                userEnquirySchema.emailID = req.body.emailID,
                    userEnquirySchema.enquiry = {
                        userFullName: req.body.userFullName,
                        isdCode: req.body.isdCode,
                        primaryPhonenumber: req.body.primaryPhonenumber,
                        procedureName: req.body.procedureName,
                        commuMedium: req.body.commuMedium,
                        caseDescription: req.body.caseDescription,
                        attachmentFlag: req.body.attachment,
                        attachmentName: req.body.attachmentName,
                        response: []
                    }
                resolve(true)

            } else {  /* Update if atlest one query is present for the same user*/

                userEnquiryModel.findOneAndUpdate({ emailID: req.body.emailID },
                    {
                        $push: {
                            enquiry: {
                                userFullName: req.body.userFullName,
                                isdCode: req.body.isdCode,
                                primaryPhonenumber: req.body.primaryPhonenumber,
                                procedureName: req.body.procedureName,
                                commuMedium: req.body.commuMedium,
                                caseDescription: req.body.caseDescription,
                                attachmentFlag: req.body.attachment,
                                attachmentName: req.body.attachmentName,
                                response: []
                            }
                        }
                    },
                    { new: true }, function (err, doc) {
                        if (err) {
                            logger.error('Error while updating record : - ' + err.message);
                            return reject(res.status(409).json({
                                Message: 'Error while saving enquiry for user ' + req.body.emailID + ' in user enquiry collection'
                            }));
                        } else if (doc === null) {
                            logger.error('Error while updating record : - unable to update database');
                            return reject(res.status(409).json({
                                Message: 'Error while saving enquiry for user ' + req.body.emailID + ' due to ' + err.message
                            }));
                        }
                        resolve(false);
                    });
            }
        })
    })
    .then(function (flag) {
        if (flag) {//save only for insert and skip for update
            userEnquirySchema.save(function (error, data) {
                if (error) {
                    logger.error('Error while inserting record in user enquiry collection: - ' + error.message)
                    return res.status(500).json({ Message: error.message.trim() });
                }
                else {
                    return res.json({ Message: 'Data got inserted successfully' });
                }
            })
        }
    })
    .catch(function (err) {
        logger.error('Error while inserting record in : - ' + err.message)
        return res.status(500).json({ Message: err.message });
    })
}

/************************ API code to send response to email ****************************/
module.exports.sendEnquiryResponse = function (req, res) {

    if (res.headersSent) {//check if header is already returned
        logger.warn('Response already sent.Hence skipping the function call sendEnquiryResponse')
        return;
    }

    var userEnquirySchema = new userEnquiryModel();

    var userEmailID = req.params.userEmail;
    var enquiryID = req.params.enquiryID;

    //Create dbcheck promise
    new Promise(function (resolve, reject) {
        userEnquiryModel.findOne({ emailID: userEmailID, enquiry: { $elemMatch: { enquiryCode: enquiryID } } }, function (err, doc) {
            if(err)
            {
                return reject(res.status(500).json({
                    Message: 'We apologize,there is an issue with submission of enquiry'
                }));
            }
             else if (doc === null) {
                 logger.info('Enquiry for user  ' + userEmailID + ' with query id ' + enquiryID + ' does not exists in database');
                 return reject(res.status(409).json({
                     Message: 'Enquiry for user  ' + userEmailID + ' with query id ' + enquiryID + ' does not exists in database'
                 }));
             }
             resolve();
         });
    }).then(function () {
        userEnquiryModel.findOneAndUpdate({ emailID: userEmailID, enquiry: { $elemMatch: { enquiryCode: enquiryID } }},
            {
                $push: {
                    'enquiry.$.response': {
                        mediNovitaResponse: req.body.mediNovitaResponse,
                        respondedBy: req.body.respondedBy,
                        contactedMethod: req.body.contactedMethod,
                        emailResponseSent: req.body.emailResponseSent,
                        nextFollowUpDate: req.body.followupDate,
                        followUpAssignee: req.body.followupAssignee,
                        followUpNote: req.body.followupNote,
                    }
                }
            },
            { returnOriginal: false, upsert: true }, function (err, doc) {
                if (err) {
                    logger.error('Error while updating record : - ' + err.message);
                    return res.status(409).json({
                        Message: 'Error while saving response for user ' + userEmailID + ' enquiry in user enquiry collection'
                    });
                } else if (doc === null) {
                    logger.error('Error while updating record : - unable to update database');
                    return res.status(409).json({
                        Message: 'Error while saving response for user ' + userEmailID + ' enquiry in user enquiry collection ' + err.message
                    });
                }
            });

    }).then(function () {
        userEnquirySchema.save(function (error, data) {
            if (error) {
                logger.error('Error while inserting record in user enquiry collection: - ' + error.message)
                return res.status(500).json({ Message: error.message.trim() });
            }
            else {
                return res.json({ Message: 'Data got inserted successfully' });
            }
        })

    })
    .catch(function (err) {
        logger.error('Error while inserting record in : - ' + err.message)
        return res.status(500).json({ Message: err.message });
    })
}

/************************ API code to get un answered queries ****************************/
module.exports.getPendingEnquiryResponse = function (req, res) {

    if (res.headersSent) {//check if header is already returned
        logger.warn('Response already sent.Hence skipping the function call getPendingEnquiryResponse')
        return;
    }

    userEnquiryModel.aggregate([
    {
        $match: {
            response: { $exists: false, $ne: [] }
        }
    },
    {
    $project: {
        _id: 0,
        emailID: 1,
        enquiry: {
            $setDifference: [
                {
                    $map: {
                        input: '$enquiry',
                        as: 'enquiry',
                        in: {
                            $cond: [//specify the filter here
                                {
                                  // "$eq": ["$$enquiry.userFullName", "Libin Sebastian new"] },
                                },
                                { userFullName: '$$enquiry.userFullName', primaryPhonenumber: '$$enquiry.primaryPhonenumber', caseDescription: '$$enquiry.caseDescription'},
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
        logger.error('Error while reading list of enquiries where response is required');
        return res.status(500).json({ Message: err.message.trim() });
    } else if (result === null) {
        logger.info('There are no enquiries where response is due');
        return res.status(200).json({ Message: err.message.trim() });
    }
    else {
        return res.json(result);
    }
  })

}

/************************ API code to read user questionnaire  ****************************/
module.exports.submitUserQuestionnaire = function (req, res) {

    if (res.headersSent) {//check if header is already returned
        logger.warn('Response already sent.Hence skipping the function call submitUserQuestionnaire')
        return;
    }
    var sendTO = '';
    var subject = '';
    new Promise(function (resolve, reject) {    
        sendTO = req.body.contactemail       
        subject = 'User ' + req.body.Submitted_By + ' submitted questionnaire'

        var welcome = 'Dear ' + req.body.Submitted_By + ',' + '\r\n' + '\r\n' + 'Greetings of the day.This is to acknowledge that we have received your inputs.We are working on high priority to come up with the best packages at attractive rates based on your inputs.We will revert back within two working days.' + '\r\n' + '\r\n'
            + 'Thank you for showing interest in Medinovita.' + '\r\n' + '\r\n'  + "Below are the details submitted by you.Feel free to submit the survey agin if any of the informations furnished below is inaccurate" + '\r\n' + '\r\n' 

        var emailBody = welcome  + 'Submitted By :  ' + req.body.Submitted_By + '\r\n' + 
            'Contact Email :  ' + req.body.contactemail + '\r\n' + 
            'Contact Number :  ' + req.body.contact_number + '\r\n' + 
            'Patients Age :  ' + req.body.Patient_age + " years"  + '\r\n' + 
            'Treatment Requested :  ' + req.body.contact_message + '\r\n' + 
            'Patient Gender :  ' + req.body.gender + '\r\n' + 
            'Patient Height :  ' + req.body.patient_height + " cm " + '\r\n' + 
            'Patient Weight :  ' + req.body.Patinet_weight + " kg" + '\r\n' +
            'Problem Start Date :  ' + req.body.When_did_problem_start + '\r\n' +
            'Prior treatments :  ' + req.body.prior_treatments + '\r\n' +
            'Current Symptoms :  ' + req.body.current_symptoms + '\r\n' +
            'Have you travelled abroad any time for this treatment? :  ' + req.body.radio_travelled_abroad + '\r\n' +
            'Do you have Medical Reports with you? :  ' + req.body.medical_reports_yes + '\r\n' +
            'Are you diabetic :  ' + req.body.diebetic + '\r\n' +
            'Do you have high blood pressure? :  ' + req.body.bp + '\r\n' +
            'Do you have HIV :  ' + req.body.hiv + '\r\n' +
            'Do you have Hepatitis B or C :  ' + req.body.Hepatitis + '\r\n' +
            'When do you plan to travel for treatment :  ' + req.body.travel_date + '\r\n' +
            'What type of hospitals do you prefer :  ' + req.body.hospital_preference + '\r\n' +
            'What kind of accomodation do you prefer :  ' + req.body.accomodation_preference + '\r\n' +
            'Do you have a location preference :  ' + req.body.location_preference + '\r\n' +
            'Would you like to get Medical Visa assistance? :  ' + req.body.visa_assistance + '\r\n' +
            'Would you like to get assistance to book flight tickets? :  ' + req.body.flight_ticket + '\r\n' +
            'Would you like to avail a leisure trip? :  ' + req.body.leisure_trip + '\r\n' +
            'Preferred Time for call :  ' + req.body.Preferred_time + '\r\n' + '\r\n'  + 'Thanks & Regards' + '\r\n' + 'Medinovita customer care team'              
            resolve(emailBody)

    }).then(function (emailBody) {        
        autoMail.sendEmail(sendTO, subject, emailBody, false, function (callback) { }) 
        return res.status(200).end('Email has been sent successfully');
    })
    .catch(function (err) {
        logger.error('Error while senting email : - ' + err.message)
        return res.status(500).json({ Message: err.message });
    })
}
