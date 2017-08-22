var mongoose = require('mongoose');
var genericUtil = require('../controller/utilities/generic.js');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var SchemaTypes = mongoose.Schema.Types;

const collection = 'treatments_offered';

var treamentOfferedSchema = new Schema({

    procedureId: { type: Number, required: true, unique: true, dropDups: true, default: 10000 },
    procedureMedicalName: { type: String, required: true, trim: true },
    procedureShortName: { type: String, required: false, trim: true },
    procedureaboutFilename: { type: String, required: false, trim: true },
    procedureparentDepartment: { type: String, required: true, trim: true },
    procedureparentDepartmentid: { type: Number, required: true, unique: true, dropDups: true },
    
});

//create collection.
module.exports.treatmentModel = mongoose.model(collection, treamentOfferedSchema);

















