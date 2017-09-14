var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');

var genericUtil = require('../controller/utilities/generic.js');
var Schema = mongoose.Schema;

const collection = 'treatmentOffered_description';

var treatmentDescriptionSchema = new Schema({
    treatmentName: { type: String, required: true, trim: true },
    displayName: { type: String, required: true, trim: true },
    treatmentDescription: { type: String, required: true, trim: true },
    minHospitalization: { type: Number, required: true },
    maxHospitalization: { type: Number, required: true },
    surgicalTime: { type: Number, required: false },
    postFollowupDuration: { type: Number, required: false },
    postFollowupFrequency: { type: Number, required: false },
    isDisable: { type: String, required: true, trim: true, enum: ['Y', 'N'], default: 'N' }
    
});

//create collection.
module.exports.treatmentOfferedModel = mongoose.model(collection, treatmentDescriptionSchema);

