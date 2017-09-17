var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var counterSchema = require('./identityCounterModel.js');
var genericUtil = require('../controller/utilities/generic.js');
var Schema = mongoose.Schema;

const collection = 'hotel_details';

var accomodationSchema = new Schema({

    hotelID: { type: Number, required: true, trim: true,unique:true },
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
    hotelRating: { type: String, required: true, trim: true, enum: ['3 Star', '4 Star', '5 Star', '7 Star', 'Executive AC', 'Deluxe AC', 'Service Apartment']},
    singleBedRoomCost: { type: Number, required: true },
    doubleBedRoomCost: { type: Number, required: true },
    suiteRoomCost: { type: Number, required: false },
    extraGuestCost: { type: Number, required: false},
    complimentaryBreakfast: { type: String, required: false, enum: ['Y', 'N'], default: 'Y' },
    buffetLunchCost: { type: Number, required: false },
    buffetDinnerCost: { type: Number, required: false },
    checkInTime: { type: String, required: true },
    checkOutTime: { type: String, required: true },
    freeAirportPickup: { type: String, required: false, enum: ['Y', 'N'], default: 'N' },
    freeLocalTransfer: { type: String, required: false, enum: ['Y', 'N'], default: 'N' },
    amnities: { type: String, required: false},
});

module.exports.accomodationModel = mongoose.model(collection, accomodationSchema);