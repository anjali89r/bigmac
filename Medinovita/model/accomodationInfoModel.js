var mongoose = require('mongoose');
var counterSchema = require('./identityCounterModel.js');
var genericUtil = require('../controller/utilities/generic.js');
var Schema = mongoose.Schema;

const collection = 'hotel_details';

var accomodationSchema = new Schema({

    hotelID: { type: Number, required: true, trim: true,unique:true },
    name: { type: String, required: false, trim: true },
    hotelRating: { type: String, required: true, trim: true, enum: ['3 star', '4 star', '5 star', '7 star', 'Executive AC', 'Deluxe AC', 'Service Apartment'] },
    contact: {        
        addressLine1: { type: String, required: true },
        addressLine2: { type: String, required: false },
        city: { type: String, required: true },
        postalCode: { type: Number, required: true },
        residingcountry: { type: String, required: true },
        landmark: { type: String, required: true },
        contactPerson: { type: String, required: true },
        contactEmailId: { type: String, required: true },
        primaryContactNumber: { type: Number, required: true },
        secondaryContactNumber: { type: String, required: false }
    },    
    cost: {
        singleBedRoomCost: { type: Number, required: true },
        doubleBedRoomCost: { type: Number, required: true },
        suiteRoomCost: { type: Number, required: false },
        extraGuestCost: { type: Number, required: false },
        buffetLunchCost: { type: Number, required: false },
        buffetDinnerCost: { type: Number, required: false },
    },  
    freebee: {
        complimentaryBreakfast: { type: String, required: false, enum: ['Y', 'N'], default: 'Y' },
        freeAirportPickup: { type: String, required: false, enum: ['Y', 'N'], default: 'N' },
        freeLocalTransfer: { type: String, required: false, enum: ['Y', 'N'], default: 'N' },
    },
    checkInTime: { type: String, required: true },
    checkOutTime: { type: String, required: true },    
    amnities: { type: String, required: false },
    serviceActiveFlag: { type: String, required: true, enum: ['Y', 'N'] },
});

module.exports.accomodationModel = mongoose.model(collection, accomodationSchema);