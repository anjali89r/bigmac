var mongoose = require('mongoose');
var genericUtil = require('../controller/utilities/generic.js');
var Schema = mongoose.Schema;

const collection = 'holiday_package';

var holidayPackageSchema = new Schema({

    holidayPackageId: { type: Number, required: true },
    packageShortName: { type: String, required: true, trim: true },
    packageDescription: { type: String, required: true },
    packageDuration: { type: Number, required: true },
    tourOperator: { type: Number, required: false },
    postFollowupDuration: { type: Number, required: false },
    postFollowupFrequency: { type: Number, required: false },
    packageCost: { type: Number, required: false}
});

//create collection.
module.exports.holidayPackageModel = mongoose.model(collection, holidayPackageSchema);

