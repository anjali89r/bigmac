var mongoose = require('mongoose');
var autoIncrement = require('mongoose-plugin-autoinc');
var genericUtil = require('../controller/utilities/generic.js');
var Schema = mongoose.Schema;
var SchemaTypes = mongoose.Schema.Types;

const collection = 'site_traffic';

var siteTrafficSchema = new Schema({

    browserType: { type: String, required: true, trim: true },
    sourceipAddress: { type: String, required: true, trim: true },
    datetimeAccessed: { type: String, required: true, trim: true },
    country: { type: String, required: false, trim: true }
        
});

//create collection.
module.exports.siteTrafficModel = mongoose.model(collection, siteTrafficSchema);