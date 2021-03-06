﻿var mongoose = require('mongoose');
var autoIncrement = require('mongoose-plugin-autoinc');
var genericUtil = require('../controller/utilities/generic.js');
var Schema = mongoose.Schema;
var SchemaTypes = mongoose.Schema.Types;

const collection = 'user_enquiry';

var userEenquirySchema = new Schema({

        emailID: {
            type: String,
             required: true, unique: true, trim: true, match: /^([a-zA-Z0-9_.-])+@([a-zA-Z0-9_.-])+\.([a-zA-Z])+([a-zA-Z])+/
        },

        enquiry: [{

        userFullName: { type: String, required: true, unique: false, trim: true},
        isdCode: {
                type: String, required: true,
                min: [1, 'The value of path `{PATH}` ({VALUE}) is beneath the limit ({MIN}).'],
                max: [900, 'The value of path `{PATH}` ({VALUE}) exceeds the limit ({MAX}).']
            },
            primaryPhonenumber: {
                type: String,
                validate: {
                    validator: function (primaryPhonenumber) {
                        if (isNaN(primaryPhonenumber) || primaryPhonenumber.toString().trim().length != 10) {
                            return false;
                        }
                    },
                    message: '{VALUE} is not a valid primary phone number!'
                },
                required: [true, 'User phone number required']
            },
            procedureName: { type: String, required: false, trim: true },
            commuMedium: { type: String, required: false, unique: false, trim: true, default: 'English' },
            caseDescription: { type: String, required: false, unique: false, trim: true },
            attachmentFlag: { type: String, required: false, enum: ['Y', 'N'], default: 'N' },
            attachmentName: { type: String, required: false },
            enquiryCode: { type: String, required: true },
            questionnaire: { type: String, required: false },
            status: {
                type: String, required: true, enum: ['Enquiry Received', 'Assigned To CA', 'Response Sent', 'Awaiting customer response', 'Followup Needed', 'In Progress', 'Undergoing Treatment', 'Returned to home', 'Not interested', 'Closed'], default: 'Enquiry Received' },
            response: [{
                mediNovitaResponse: { type: String, required: false, unique: false, trim: true },
                respondedBy: { type: String, required: false, unique: false, trim: true },
                contactedMethod: { type: String, required: false, enum: ['Phone', 'Email', 'Both'] },
                emailResponseSent: { type: String, required: false, enum: ['Y', 'N'] },
                nextFollowUpDate: { type: String, required: false },
                followUpAssignee: { type: String, required: false, unique: false, trim: true },
                followUpNote: { type: String, required: false, unique: false, trim: true },
                respondedAt: { type: Date, required: true, default: Date.now },
            }],
        }],
        updated_at: { type: Date, required: true, default: Date.now }
});

//create collection.
module.exports.userEnquiryModel = mongoose.model(collection, userEenquirySchema);
