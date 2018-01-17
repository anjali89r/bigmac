const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

const genericUtil = require('../controller/utilities/generic.js');
const Schema = mongoose.Schema;

const collection = 'services_collection';

var servicesSchema = new Schema({
    serviceName: { type: String, required: true, trim: true },
    serviceShortform: { type: String, required: true, trim: true },
    serviceDescription: { type: String, required: true, trim: true },
    
    isDisable: { type: String, required: true, trim: true, enum: ['Y', 'N'], default: 'N' }
    
});

//create collection.
module.exports.ourServiceModel = mongoose.model(collection, servicesSchema);

