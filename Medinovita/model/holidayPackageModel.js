var mongoose = require('mongoose');
var genericUtil = require('../controller/utilities/generic.js');
var Schema = mongoose.Schema;

const collection = 'holiday_package';

var holidayPackageSchema = new Schema({

    holidayPackageId: { type: Number, required: false },
    packageShortName: { type: String, required: false, trim: true },
    packageDescription: { type: String, required: false },
    packageDuration: { type: String, required: false },
    tourOperator: { type: String, required: false },
    website: { type: String, required: false }, 
    packageCost: { type: Number, required: false },
    activeStatus: { type: String, required: false, enum: ['Y', 'N']}
});

//create collection.
module.exports.holidayPackageModel = mongoose.model(collection, holidayPackageSchema);

