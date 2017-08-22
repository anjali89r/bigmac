var mongoose = require('mongoose');
require('mongoose-double')(mongoose);
require('mongoose-integer')(mongoose);
var autoIncrement = require('mongoose-auto-increment');
var counterSchema = require('./identityCounterModel.js');
var genericUtil = require('../controller/utilities/generic.js');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var SchemaTypes = mongoose.Schema.Types;

const collection = 'hospital_doctor_details';

var hospitalDoctorSchema = new Schema({

    hospitalName: { type: String, required: true, trim: true },
    hospitalID: { type: Number, required: true, unique: true, dropDups: true},    

    hospitalContact: {
        website: { type: String, required: true, trim: true },
        contactPersonname: { type: String, required: true, trim: true },
        addressLine1: { type: String, required: true, trim: true },
        addressLine2: { type: String, required: false, trim: true },
        City: { type: String, required: true, trim: true },
        PostalCode: { type: Number, required: true, trim: true },
        country: { type: String, required: true, trim: true },
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
        procedureid: { type: Number},
        departmentId: { type: Number},
                name: { type: String, required: true, trim: true },
                costUpperBound: { type: Number, required: true },
                costLowerBound: { type: Number, required: true },                   
                departmentName: { type: String, required: true, trim: true},
                
                doctor: [{

                    doctorId: { type: Number},
                    doctorName: { type: String, required: true, trim: true },
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
                                    userRating:{type: Number, required: false,
                                        min: [1, 'The value of path `{PATH}` ({VALUE}) is beneath the limit ({MIN}).'],
                                        max: [5, 'The value of path `{PATH}` ({VALUE}) exceeds the limit ({MAX}).'],
                                        default: 4
                                    },
                                    userId: { type: Number, required: false, trim: true},
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


