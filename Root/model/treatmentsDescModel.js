var mongoose = require('mongoose');
var genericUtil = require('../controller/utilities/generic.js');
var Schema = mongoose.Schema;

const collection = 'treatmentOffered_description';

var treatmentDescriptionSchema = new Schema({
   
    department: { type: String, required: false, unique: true, trim: true },
    departmentId: { type: Number, required: false, trim: true },
    departmentDescription: { type: String, required: false, trim: true },
    serviceActiveFlag: { type: String, required: false, trim: true, enum: ['Y', 'N'] },
    departmentImagepath: { type: String, required: false, trim: true },
    treatmentList: [{
        procedureId: { type: Number, required: false, trim: true },
        procedureName: { type: String, required: true, unique: true, trim: true },
        displayName: { type: String, required: true, unique: true, trim: true },
        treatmentDescription: { type: String, required: true, trim: true },       
        shortDescription: { type: String, required: true, trim: true },        
        healingTimeInDays: { type: String, required: true },        
        minHospitalization: { type: Number, required: true },
        maxHospitalization: { type: Number, required: true },
        surgicalTime: { type: Number, required: false },
        postFollowupDuration: { type: Number, required: false },
        postFollowupFrequency: { type: String, required: false },
        procedureImagepath: { type: String, required: false, trim: true },
        activeFlag: { type: String, required: true, trim: true, enum: ['Y', 'N'] },        
    }]
});

//create collection.
module.exports.treatmentOfferedModel = mongoose.model(collection, treatmentDescriptionSchema);

