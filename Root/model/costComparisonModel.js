var mongoose = require('mongoose');
var genericUtil = require('../controller/utilities/generic.js');
var Schema = mongoose.Schema;

const collection = 'treatment_cost_comparison';

var costComparisonSchema = new Schema({

    procedureName: { type: String, required: true, unique: true, trim: true },
    activeFlag: { type: String, required: true, trim: true, enum: ['Y', 'N'], default: 'Y' },
    countryWise: [{
        country: { type: String, required: true, trim: true },
        cost: { type: String, required: true, trim: true },
        currency: { type: String, required: true, trim: true, enum: ['$', 'INR'], default: '$' },        
        activeFlag: { type: String, required: true, trim: true, enum: ['Y', 'N'], default: 'Y' }, 

    }]
})

//create collection.
module.exports.costComparisonModel = mongoose.model(collection, costComparisonSchema);

