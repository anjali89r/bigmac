var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
require('mongoose-double')(mongoose);
require('mongoose-integer')(mongoose);
var autoIncrement = require('mongoose-auto-increment');
var genericUtil = require('../controller/utilities/generic.js');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var SchemaTypes = mongoose.Schema.Types;

const collection = 'service_offered_menu';

var serviceMenuSchema = new Schema({

    serviceId: { type: Number, required: true, unique: true, dropDups: true, default: 10000 },
    serviceName: { type: String, required: true, trim: true },
    serviceMenuname: { type: String, required: true, trim: true }
    
});

serviceMenuSchema.plugin(autoIncrement.plugin, { model: collection, field: 'serviceId', startAt: 10000, incrementBy: 1 });

//create collection.
module.exports.serviceMenuModel = mongoose.model(collection, serviceMenuSchema);

















