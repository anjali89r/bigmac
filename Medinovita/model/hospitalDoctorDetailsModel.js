var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var counterSchema = require('./identityCounterModel.js');
var genericUtil = require('../controller/utilities/generic.js');
var Schema = mongoose.Schema;

const collection = 'hospital_doctor_details';

var hospitalDoctorSchema = new Schema({

    hospitalName: { type: String, required: false, trim: true },
    hospitalID: { type: Number, required: false, unique: true, dropDups: true }, 
    serviceActiveFlag: { type: String, required: false, enum: ['Y', 'N'], default: 'Y'  },//new
    hospitalimage: { type: String, required: false, trim: true },   // newly added for hospital image in webpage

    hospitalContact: {
        website: { type: String, required: false, trim: true },
        contactPersonname: { type: String, required: false, trim: true },
        emailId: { type: String, required: false, trim: true },//new
        primaryPhoneNumber: { type: Number, required: false }, //new
        secondaryPhoneNumber: { type: String, required: false }, //new
        addressLine1: { type: String, required: false, trim: true },
        addressLine2: { type: String, required: false, trim: true },
        City: { type: String, required: false, trim: true },
        State: { type: String, required: false, trim: true },   // added for displaying state in webpage
        PostalCode: { type: Number, required: false, trim: true },
        country: { type: String, required: false, trim: true },
        Landmark: { type: String, required: false, trim: true },
    },

    Accreditation: {
        JCI: { type: String, required: true, trim: true, enum: ['Y', 'N'], default: 'N' },
        NABH: { type: String, required: true, trim: true, enum: ['Y', 'N'], default: 'N'},
        NABL: { type: String, required: true, trim: true, enum: ['Y', 'N'], default: 'N' },
    },

    hospitalRating: {
        userRating: [{
                    type: Number, required: false, 
                    min: [1, 'The value of path `{PATH}` ({VALUE}) is beneath the limit ({MIN}).'],
                    max: [5, 'The value of path `{PATH}` ({VALUE}) exceeds the limit ({MAX}).'],
                    default: 4
        }],
        medinovitaRating: {
                            type: Number, required: true,
                            min: [1, 'The value of path `{PATH}` ({VALUE}) is beneath the limit ({MIN}).'],
                            max: [5, 'The value of path `{PATH}` ({VALUE}) exceeds the limit ({MAX}).'], 
                            default: 4
            },
    },
    
    Treatment: [{        
        procedureid: { type: Number },
        activeFlag: { type: String, required: true, enum: ['Y', 'N'], default: 'Y' },//new
        departmentId: { type: Number},
                name: { type: String, required: true, trim: true },
                costUpperBound: { type: Number, required: true },
                costLowerBound: { type: Number, required: true },                   
                departmentName: { type: String, required: true, trim: true },
                /*discountRatePercent: { type: Number, required: true,},
                discountStartDate: { type: Date, required: true },
                discountEndDate: { type: Date, required: true },
                discountStatus: { type: String, required: true, enum: ['Y', 'N'] },
                medinovitaDiscountRatePercent: { type: Number, required: true, },
                medinovitaDiscountStartDate: { type: Date, required: true },
                medinovitaDiscountEndDate: { type: Date, required: true },
                medinovitaDiscountStatus: { type: String, required: true, enum: ['Y', 'N'] },*/
                
                doctor: [{

                    doctorId: { type: Number},
                    doctorName: { type: String, required: true, trim: true },
                    doctorDescription: { type: String, required: true, trim: true },
                    activeFlag: { type: String, required: true, enum: ['Y', 'N'], default: 'Y' },
                    speciality: [{
                        specialityName: { type:String, required: true, trim: true }
                    }],
                    profilepicdir: { type: String, required: false, trim: true },
                    medinovitadoctorRating: {
                        type: Number, required: true,
                        min: [1, 'The value of path `{PATH}` ({VALUE}) is beneath the limit ({MIN}).'],
                        max: [5, 'The value of path `{PATH}` ({VALUE}) exceeds the limit ({MAX}).'],
                        default: 4
                        
                    },
                    DoctorUserRating:[ {  
                                    userRating:{type: Number, required: true, //To get default rating for cost api
                                        min: [1, 'The value of path `{PATH}` ({VALUE}) is beneath the limit ({MIN}).'],
                                        max: [5, 'The value of path `{PATH}` ({VALUE}) exceeds the limit ({MAX}).'],
                                        default: 4
                                    }, 
                                    userId: { type: String, required: false, trim: true, default: 'medinovita@gmail.com'},
                    }],
                }],
    }],
    updated_at: { type: Date, required: true, default: Date.now }
});

//increase the value of files using autoIncrement plugin
/*hospitalDoctorSchema.plugin(autoIncrement.plugin, {model: collection,field: 'hospitalID',startAt: 10000,incrementBy: 1});
hospitalDoctorSchema.plugin(autoIncrement.plugin, {model: collection,field: 'Treatment.$.procedureid',startAt: 10000, incrementBy: 1});
hospitalDoctorSchema.plugin(autoIncrement.plugin, {model: collection,field: 'Treatment.$.departmentId',startAt: 10000,incrementBy: 1});
hospitalDoctorSchema.plugin(autoIncrement.plugin, {model: collection,field: 'Treatment.$.doctor.$.doctorId',startAt: 10000,incrementBy: 1});*/

//override the default values before save
/*hospitalDoctorSchema.pre('save', function (next) {

   
   
}); */

//create collection.
module.exports.hospitalModel = mongoose.model(collection, hospitalDoctorSchema);


