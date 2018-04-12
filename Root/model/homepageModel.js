const mongoose = require('mongoose');
const autoIncrement = require('mongoose-plugin-autoinc');

const genericUtil = require('../controller/utilities/generic.js');
const Schema = mongoose.Schema;

const collection = 'homepage_collection';

var homepageSchema = new Schema({
    customerCareno: { type: String, required: true, trim: true },
    whatsappCustomercareno: { type: String, required: true, trim: true },
    fburlLink: { type: String, required: true, trim: true },
    twitterurlLink: { type: String, required: true, trim: true },
    linkedlinurlLink: { type: String, required: true, trim: true },
    instagramurlLink: { type: String, required: true, trim: true },
    whyIndiaDesc: { type: String, required: true, trim: true },
    whymedinovitaDesc: { type: String, required: true, trim: true }
       
    
});

//create collection.
module.exports.homePageModel = mongoose.model(collection, homepageSchema);

