var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');

var genericUtil = require('../controller/utilities/generic.js');
var Schema = mongoose.Schema;

const collection = 'treatmentOffered_description';

var treatmentDescriptionSchema = new Schema({
   
    procedureName: { type: String, required: true, trim: true },
    displayImagepath: { type: String, required: true, trim: true },
    shortDescription: { type: String, required: true, trim: true },
    treatmentDescription: { type: String, required: true, trim: true },    
    healingTime: { type: String, required: true },  
    
    treatmentName: { type: String, required: true,unique:true, trim: true },
    displayName: { type: String, required: true, unique:true,trim: true },
    treatmentDescription: { type: String, required: true, trim: true },
    minHospitalization: { type: Number, required: true },
    maxHospitalization: { type: Number, required: true },
    surgicalTime: { type: Number, required: false },
    postFollowupDuration: { type: Number, required: false },

    postFollowupFrequency: { type: String, required: false },
    isDisable: { type: String, required: true, trim: true, enum: ['Y', 'N'], default: 'N' }
    
});

//create collection.
module.exports.treatmentOfferedModel = mongoose.model(collection, treatmentDescriptionSchema);

