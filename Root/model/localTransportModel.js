﻿var mongoose = require('mongoose');
var counterSchema = require('./identityCounterModel.js');
var genericUtil = require('../controller/utilities/generic.js');
var Schema = mongoose.Schema;

const collection = 'local_transport_details';

var localTransportSchema = new Schema({

    providerID: { type: Number, required: false},
    name: { type: String, required: false, trim: true },
    serviceActiveFlag: { type: String, required: true, enum: ['Y', 'N'] ,default:'Y'},
    contact: {
        addressLine1: { type: String, required: false },
        addressLine2: { type: String, required: false },
        city: { type: String, required: false },
        postalCode: { type: Number, required: false },
        residingcountry: { type: String, required: false },
        landmark: { type: String, required: false },
        contactPerson: { type: String, required: false },
        contactEmailId: { type: String, required: false },
        primaryContactNumber: {
            type: Number,
            validate: {
                validator: function (primaryContactNumber) {
                    if (isNaN(primaryContactNumber) || primaryContactNumber.toString().trim().length != 10) {
                        return false;
                    }
                },
                message: '{VALUE} is not a valid primary phone number!'
            },
            required: [false, 'User phone number required']
        },

        secondaryContactNumber: {type: String,required: false}, 
    }, 
    vehicle: [{
        vehicleType:{ type: String, required: false, enum: ['sedan', 'hatchback', 'suv', 'mpv', 'luxury'] },
        minimumChargeforDayUse: { type: Number, required: true },
        noAdditionalChargesUpToKM: { type: Number, required: false},
        chargePerKiloMeter: { type: Number, required: true },
        selfDriven: { type: String, required: false, enum: ['Y', 'N'] },
        additionalChargesPerKiloMeter: { type: Number, required: false },
        minimumDriverBata: { type: Number, required: false },
        driverBataPerKiloMeter: { type: Number, required: false },
        activeFlag: { type: String, required: true, enum: ['Y', 'N'] },
        currency: { type: String, required: true, enum: ['INR', '$'] }, //new field added on 26/11/17
    }]
});

module.exports.transportModel = mongoose.model(collection, localTransportSchema);