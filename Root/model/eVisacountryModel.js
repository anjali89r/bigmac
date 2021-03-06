﻿const mongoose = require('mongoose');
const autoIncrement = require('mongoose-plugin-autoinc');

const genericUtil = require('../controller/utilities/generic.js');
const Schema = mongoose.Schema;

const collection = 'evisacountries';

var evisaSchema = new Schema({
    countrylist: [{
        id: { type: Number, required: true, unique: true },
        country: { type: String, required: true, trim: true, unique: true },
        fee: { type: Number, required: true },
        dial_code: { type: String, required: true, trim: true, unique: true},
        code: { type: String, required: true, trim: true },
        disabled: { type: Boolean, required: true, enum: [false, true], default: false }
    }]
});

//create collection.
module.exports.eVisacountryModel = mongoose.model(collection, evisaSchema);

