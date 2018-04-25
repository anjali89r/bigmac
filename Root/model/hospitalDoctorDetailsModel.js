var mongoose = require('mongoose');
var autoIncrement = require('mongoose-plugin-autoinc');
var counterSchema = require('./identityCounterModel.js');
var genericUtil = require('../controller/utilities/generic.js');
var Schema = mongoose.Schema;

const collection = 'hospital_doctor_details';

var hospitalDoctorSchema = new Schema({

    hospitalName: { type: String, required: true, trim: true },    
    hospitalID: { type: Number, required: false, unique: true, dropDups: true }, 
    serviceActiveFlag: { type: String, required: true, enum: ['Y', 'N'], default: 'Y'  },//new
    hospitalimage: { type: String, required: true, trim: true, default: 'medinovita/blankHospital.jpg' },   // newly added for hospital image in webpage
    hospitalDescription: { type: String, required: true, trim: true},   // newly added for hospital description
    hospitaldisplayname: { type: String, required: false, trim: true },
    hospitalContact: {
        website: { type: String, required: true, trim: true },
        contactPersonname: { type: String, required: true, trim: true },
        emailId: { type: String, required: true, trim: true },//new
        primaryPhoneNumber: { type: Number, required: true }, //new
        secondaryPhoneNumber: { type: String, required: false }, //new
        addressLine1: { type: String, required: true, trim: true },
        addressLine2: { type: String, required: false, trim: true },
        State: { type: String, required: false, trim: true },   // added for displaying state in webpage
        City: { type: String, required: true, trim: true },       
        PostalCode: { type: Number, required: true, trim: true },
        country: { type: String, required: true, trim: true },
        Landmark: { type: String, required: false, trim: true },
    },


    Accreditation: [{
        agency: { type: String, required: false, trim: true, enum: ['NABH', 'ISO9001', 'JCI'] },         
    }],

    hospitalRating: {
        userRating: [{
                    type: Number, required: false, 
                    min: [1, 'The value of path `{PATH}` ({VALUE}) is beneath the limit ({MIN}).'],
                    max: [5, 'The value of path `{PATH}` ({VALUE}) exceeds the limit ({MAX}).'],
                    default: 4
        }],
        medinovitaRating: {
                            type: Number, required: false,
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
        treatmentdisplayname: { type: String, required: false, trim: true },//for storing values with _
        costUpperBound: { type: Number, required: true },
        costLowerBound: { type: Number, required: true },  
        currency: { type: String, required: true, enum: ['INR'] }, //new field added on 26/11/17
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

            doctorId: { type: Number },
            registrationNumber: { type: String, required: true, trim: true, unique: true },
            registrationAuthority: { type: String, required: true, trim: true },
            doctorShortName: { type: String, required: false, trim: true },
            doctorName: { type: String, required: true, trim: true },            
            doctorDescription: { type: String, required: true, trim: true },
            activeFlag: { type: String, required: true, enum: ['Y', 'N'], default: 'Y' },
            speciality: [{
                specialityName: { type:String, required: true, trim: true }
            }],
            profilepicdir: { type: String, required: false, trim: true, default: 'medinovita/blankDoctor.png' },
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
 // added for the urls like medinovita.in/hospital/aswini-hospital.always use lowercase value and underscore in between words instead of space
   
hospitalDoctorSchema.pre('save', function(next) {
     var hospdisplayname = this.hospitalName;
  // console.log(hospdisplayname)
    this.hospitaldisplayname = hospdisplayname.replace(/\s+/g, '-').toLowerCase();
  // console.log(this.hospitaldisplayname)

    this.Treatment.forEach(function(el)
        {
            var treatmentdisplayname=el.name;
            el.treatmentdisplayname = treatmentdisplayname.replace(/\s+/g, '-').toLowerCase();

            el.doctor.forEach(function (el) {
                var doctorShortName = el.doctorName;
                doctorShortName = doctorShortName.replace(/\s+/g, '-').toLowerCase();
                el.doctorShortName = doctorShortName.replace(/\./g, '-').toLowerCase();
            })
            
        }
    )   
    next();
  });


//create collection.
module.exports.hospitalModel = mongoose.model(collection, hospitalDoctorSchema);


