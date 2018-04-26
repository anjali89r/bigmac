var mongoose = require('mongoose');
var genericUtil = require('../controller/utilities/generic.js');
var Schema = mongoose.Schema;

const collection = 'holiday_package';

var holidayPackageSchema = new Schema({

    holidayPackageId: { type: Number, required: false },
    packageShortName: { type: String, required: false, trim: true },
    packageDescription: { type: String, required: false },
    packageImageDir: { type: String, required: false },
    packageDuration: { type: String, required: false },
    tourOperator: { type: String, required: false },
    website: { type: String, required: false }, 
    packageCost: { type: Number, required: false },
    currency: { type: String, required: true, enum: ['INR', '$'],default:'INR' }, //new field added on 26/11/17
    activeStatus: { type: String, required: true, enum: ['Y', 'N'],default:'Y'}
});

//create collection.
module.exports.holidayPackageModel = mongoose.model(collection, holidayPackageSchema);

