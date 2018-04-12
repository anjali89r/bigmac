var mongoose = require('mongoose');
var autoIncrement = require('mongoose-plugin-autoinc');
require('mongoose-double')(mongoose);
require('mongoose-integer')(mongoose);
//var autoIncrement = require('mongoose-plugin-autoinc');
var genericUtil = require('../controller/utilities/generic.js');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var SchemaTypes = mongoose.Schema.Types;

const collection = 'contact_master';

var contactMasterSchema = new Schema({

    contactId: { type: Number, required: true, unique: true, dropDups: true, default: 10000 },
    contactName: { type: String, required: true, trim: true },
    contactPerson: { type: String, required: true, trim: true },
    contactPersonGender: { type: String, required: true, trim: true, enum: ['MALE', 'FEMALE'] },
    contactAddressline1: { type: String, required: true, trim: true },
    contactAddressline2: { type: String, required: false, trim: true },
    contactCity: { type: String, required: true, trim: true },
    contactpostalCode: { type: Number, required: true, trim: true },
    contactCountry: { type: String, required: true, trim: true },
    contactLandmark: { type: String, required: false, trim: true },
    contactType: { type: String, required: false, trim: true, enum: ['HOTEL', 'TRAVEL_AGENT', 'DRIVER', 'TRANSPORT_AGENT', 'HOSPITAL'] },
    contactId: { type: Number, required: true, default: 91 },
    contactNumber: { type: Number, required: true, trim: true },
    contactEmailid: {
        type: String,lowercase: true, required: true, unique: true, trim: true, dropDups: true, match: /^([a-zA-Z0-9_.-])+@([a-zA-Z0-9_.-])+\.([a-zA-Z])+([a-zA-Z])+/, index: { unique: true }
    }
    
});

contactMasterSchema.plugin(autoIncrement.plugin, { model: collection, field: 'contactId', startAt: 10000, incrementBy: 1 });

//create collection.
module.exports.contactMasterModel = mongoose.model(collection, contactMasterSchema);

















