var mongoose = require('mongoose');
var genericUtil = require('../controller/utilities/generic.js');
var Schema = mongoose.Schema;
var SchemaTypes = mongoose.Schema.Types;

const collection = 'contactus';

var contactUsSchema = new Schema({

        emailID: {
            type: String,
             required: false, unique: true, trim: true, match: /^([a-zA-Z0-9_.-])+@([a-zA-Z0-9_.-])+\.([a-zA-Z])+([a-zA-Z])+/           
        },

        userFullName: { type: String, required: false, unique: false, trim: true },
        enquiry: [{
            subject: { type: String, required: true, unique: false, trim: true },
            message: { type: String, required: true, unique: false, trim: true },

            updated_at: { type: Date, required: true, default: Date.now }
        }]
});

//create collection.
module.exports.contactUsModel = mongoose.model(collection, contactUsSchema);