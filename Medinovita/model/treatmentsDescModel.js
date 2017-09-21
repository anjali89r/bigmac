var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');

var genericUtil = require('../controller/utilities/generic.js');
var Schema = mongoose.Schema;

const collection = 'treatmentOffered_description';

var treatmentDescriptionSchema = new Schema({
    treatmentName: { type: String, required: true, trim: true },
    procedureName: { type: String, required: true, trim: true },
    displayImagepath: { type: String, required: true, trim: true },
    shortDescription: { type: String, required: true, trim: true },
    treatmentDescription: { type: String, required: true, trim: true },
    hospitalStay: { type: String, required: true, trim: true },
    healingTime: { type: String, required: true },
    surgicalTime: { type: String, required: false },
    postFollowupDuration: { type: String, required: false },
    postFollowupFrequency: { type: String, required: false },
    isDisable: { type: String, required: true, trim: true, enum: ['Y', 'N'], default: 'N' }
    
});

//create collection.
module.exports.treatmentOfferedModel = mongoose.model(collection, treatmentDescriptionSchema);

