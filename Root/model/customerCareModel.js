var mongoose = require('mongoose');
var autoIncrement = require('mongoose-plugin-autoinc');
require('mongoose-double')(mongoose);
require('mongoose-integer')(mongoose);
//var autoIncrement = require('mongoose-plugin-autoinc');
var genericUtil = require('../controller/utilities/generic.js');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var SchemaTypes = mongoose.Schema.Types;

const collection = 'customer_care';

var customerCareSchema = new Schema({

    customerCareNumber: { type: Number, required: true, unique: true, dropDups: true},
    emailCustomerCareId: { type: String, required: true, trim: true },
    whatsappCustomerCareId: { type: Number, required: true, unique: true, dropDups: true },
    escalationCustomerCare: { type: String, required: true, trim: true }
    
});

//customerCareSchema.plugin(autoIncrement.plugin, { model: collection, field: 'serviceId', startAt: 10000, incrementBy: 1 });

//create collection.
module.exports.customerCareModel = mongoose.model(collection, customerCareSchema);

















