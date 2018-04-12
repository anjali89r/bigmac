var mongoose = require('mongoose');
var autoIncrement = require('mongoose-plugin-autoinc');
require('mongoose-double')(mongoose);
require('mongoose-integer')(mongoose);
//var autoIncrement = require('mongoose-plugin-autoinc');
var genericUtil = require('../controller/utilities/generic.js');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var SchemaTypes = mongoose.Schema.Types;

const collection = 'featured_treatment';

var featureTreatmentSchema = new Schema({

    
    img: { type: String, required: true, trim: true },
    pagePath: { type: String, required: true, trim: true },
    shortContent: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true }
    
});

//customerCareSchema.plugin(autoIncrement.plugin, { model: collection, field: 'serviceId', startAt: 10000, incrementBy: 1 });

//create collection.
module.exports.featuerTreatmentModel = mongoose.model(collection, featureTreatmentSchema);

















