var mongoose = require('mongoose');
var autoIncrement = require('mongoose-plugin-autoinc');
require('mongoose-double')(mongoose);
require('mongoose-integer')(mongoose);
//var autoIncrement = require('mongoose-plugin-autoinc');
var genericUtil = require('../controller/utilities/generic.js');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var SchemaTypes = mongoose.Schema.Types;

const collection = 'highlight_section';

var hightlightSetionSchema = new Schema({

    
    imgSrc: { type: String, required: true, trim: true },
    altText: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true, trim: true, maxlength:100 }
    
});

//customerCareSchema.plugin(autoIncrement.plugin, { model: collection, field: 'serviceId', startAt: 10000, incrementBy: 1 });

//create collection.
module.exports.highlistSectionModel = mongoose.model(collection, hightlightSetionSchema);

















