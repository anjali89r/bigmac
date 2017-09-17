var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var counterSchema = require('./identityCounterModel.js');
var genericUtil = require('../controller/utilities/generic.js');
var Schema = mongoose.Schema;

const collection = 'local_transport_details';

var localTransportSchema = new Schema({

    providerID: { type: Number, required: true, trim: true, unique: true },
    Name: { type: String, required: true, trim: true },
    contact: {
        addressLine1: { type: String, required: true },
        addressLine2: { type: String, required: false },
        City: { type: String, required: true },
        postalCode: { type: Number, required: true },
        residingcountry: { type: String, required: true },
        landmark: { type: String, required: false },
        contactPerson: { type: String, required: false },
        contactEmailId: { type: String, required: false },
        primaryContactNumber: { type: Number, required: false },
        secondaryContactNumber: { type: Number, required: false }
    },    
    vehicleType: { type: String, required: false, enum: ['sedan', 'hatchback', 'suv', 'mpv', 'luxury'] },    
    chargePerKiloMeter: { type: Number, required: false, enum: ['sedan', 'hatchback', 'suv', 'mpv', 'luxury'] },
    selfDriven: { type: String, required: false, enum: ['Y', 'N'] },
    additionalCharges: { type: String, required: false },
    driverBata: { type: String, required: false },
});

module.exports.accomodationModel = mongoose.model(collection, localTransportSchema);