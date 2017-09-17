var mongoose = require('mongoose');
var genericUtil = require('../controller/utilities/generic.js');
var Schema = mongoose.Schema;

const collection = 'holiday_package';

var holidayPackageSchema = new Schema({

    holidayPackageId: { type: Number, required: true },
    packageShortName: { type: String, required: true, trim: true },
    packageDescription: { type: String, required: true },
    packageDuration: { type: String, required: true },
    tourOperator: { type: String, required: false },
    website: { type: String, required: false }, 
    packageCost: { type: Number, required: false },
    activeStatus: { type: String, required: false, enum: ['Y', 'N'], default: 'Y'}
});

//create collection.
module.exports.holidayPackageModel = mongoose.model(collection, holidayPackageSchema);

