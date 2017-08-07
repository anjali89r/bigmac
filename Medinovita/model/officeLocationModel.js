var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
require('mongoose-double')(mongoose);
require('mongoose-integer')(mongoose);
var autoIncrement = require('mongoose-auto-increment');
var genericUtil = require('../controller/utilities/generic.js');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var SchemaTypes = mongoose.Schema.Types;

const collection = 'office_locations';

var officelocationSchema = new Schema({

    locationID: { type: Number, required: true, unique: true, dropDups: true},
    address: { type: String, required: true, trim: true },
    city: { type: String, required: true, },
    country: { type: String, required: true, trim: true },
    emailId: { type: String, required: true, trim: true },
    managerId: { type: Number, required: false, trim: true },
    contactNumber: { type: Number, required: true}

    
});

//customerCareSchema.plugin(autoIncrement.plugin, { model: collection, field: 'serviceId', startAt: 10000, incrementBy: 1 });

//create collection.
module.exports.officeLocationModel = mongoose.model(collection, officelocationSchema);

















