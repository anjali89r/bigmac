var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
require('mongoose-double')(mongoose);
require('mongoose-integer')(mongoose);
var autoIncrement = require('mongoose-auto-increment');
var genericUtil = require('../controller/utilities/generic.js');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var SchemaTypes = mongoose.Schema.Types;

const collection = 'user_details';

var userDetailsSchema = new Schema({

    emailID: {
        type: String,
        validate: {
            validator: function (emailID) {
                mongoose.model(collection, userDetailsSchema).findOne({ 'emailID': emailID }, function (err, result) { 
                    if (result !== null) return( false);
                    if (err) return (false);
                });    
            },
            message: 'user id already exists'
        },
        lowercase: true, required: true, unique: true, trim: true, dropDups: true, match: /^([a-zA-Z0-9_.-])+@([a-zA-Z0-9_.-])+\.([a-zA-Z])+([a-zA-Z])+/, index: { unique: true }
    },
    loginPassword: { type: String, required: true, trim: true },
    //userID: { type: String, lowercase: true, required: true, unique: true, trim: true, dropDups: true, default: genericUtil.getUUId },
    userID: { type: Number, required: true, unique: true, dropDups: true, default:0},

    isdCode: {
        type: Number, required: true,
        min: [1, 'The value of path `{PATH}` ({VALUE}) is beneath the limit ({MIN}).'],
        max: [200, 'The value of path `{PATH}` ({VALUE}) exceeds the limit ({MAX}).']
    },

    primaryPhonenumber: {
        type: Number,
        validate: {
            validator: function (primaryPhonenumber) {                
                if (isNaN(primaryPhonenumber) || primaryPhonenumber.toString().trim().length != 10) {
                    return false;
                }
            },
            message: '{VALUE} is not a valid primary phone number!'
        },
        required: [true, 'User phone number required']
    },

    secondaryPhonenumber: {
        type: Number,
        validate: {
            validator: function (secondaryPhonenumber) {
                if (isNaN(secondaryPhonenumber) || secondaryPhonenumber.toString().trim().length != 10) {
                    return false;
                }
            },
            message: '{VALUE} is not a valid secondary phone number!'
        },
        required: false
    },

    whatsappPhonenumber: {
        type: Number,
        validate: {
            validator: function (whatsappPhonenumber) {
                if (isNaN(whatsappPhonenumber) || whatsappPhonenumber.toString().trim().length != 10) {
                    return false;
                }                                                                         
            },
            message: '{VALUE} is not a valid watsapp phone number!'
            },
            required: false
    },

    userTitle: { type: String, required: true, trim: true,enum:['Mr.','Mrs.','Ms.'] },
    gender: { type: String, required: true, trim: true, enum: ['Male', 'Female','Other'] },
    firstName: { type: String, required: true, trim: true },
    middleName: { type: String, required: false, trim: true },
    nickName: { type: String, required: false, trim: true },
    lastName: { type: String, required: true, trim: true },
    dateofbirth: { type: String, required: true,},
    preferredContacttime: { type: String, required: true, enum: ['Morning', 'Afternoon', 'Evening', 'Night'], default:'Morning' },
    preferredContactmethod: { type: String, required: true, enum: ['Phone', 'email', 'Whatsapp', 'Skype'], default: 'Phone' },
    emailVerified: { type: String, required: true, enum: ['Y', 'N'], default: 'N'},
    userPicdir: { type: String, required: false },
    userType: {type: String, required: true, enum: ['Patient', 'Agent', 'Hospital', 'CaseManager', 'Admin'], default: 'Phone'}, 
    agentType: { type: String, required: false, enum: ['Individual', 'Organization', 'None'], default: 'None' },

    contactAddress: {
        addressType: { type: String, required: true, enum: ['Communication', 'Permanent'], default: 'Communication' },
        addressLine1: { type: String, required: true },
        addressLine2: { type: String, required: false },
        City: { type: String, required: true },
        postalCode: { type: Number, required: true },
        residingcountry: { type: String, required: true },
        landmark: { type: String, required: false }
    },

    favourites: {
        eventid: { type: String, required: true, default: genericUtil.getUUId },
        hospitalid: { type: Number, required: true},
        doctorid: { type: Number, required: true },
        treatmentId: { type: Number, required: true },

    },

    updated_at: { type: Date, required: true, default: Date.now }
});

autoIncrement.initialize(mongoose.connection);
userDetailsSchema.plugin(autoIncrement.plugin, {
    model: collection,
    field: 'userID',
    startAt: 10000,
    incrementBy: 1
});

//create collection.
module.exports.User = mongoose.model(collection, userDetailsSchema);

















