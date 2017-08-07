var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
require('mongoose-double')(mongoose);
require('mongoose-integer')(mongoose);
var autoIncrement = require('mongoose-auto-increment');
var genericUtil = require('../controller/utilities/generic.js');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var SchemaTypes = mongoose.Schema.Types;

const collection = 'treatments_offered';

var treamentOfferedSchema = new Schema({

    procedureId: { type: Number, required: false, unique: true, dropDups: true, default: 10000 },
    prodedureName: { type: String, required: true, trim: true },
    prodedureaboutFilename: { type: String, required: true, trim: true },
    prodedureparentDepartment: { type: String, required: true, trim: true },
    prodedureparentDepartmentid: { type: Number, required: false, unique: true, dropDups: true, default: 10000 },
    prodedureparentDepartmentdescription: { type: String, required: true, trim: true },
    
});

treamentOfferedSchema.plugin(autoIncrement.plugin, { model: collection, field: 'procedureId', startAt: 10000, incrementBy: 1 });

//create collection.
module.exports.treatmentModel = mongoose.model(collection, treamentOfferedSchema);

















