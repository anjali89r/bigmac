var mongoose = require('mongoose');
var counterSchema = require('./identityCounterModel.js');
var genericUtil = require('../controller/utilities/generic.js');
var Schema = mongoose.Schema;

const collection = 'Doctor_Data_Details';

var doctorSchema = new Schema({

    registrationNumber: { type: String, required: true, trim: true, unique: true },
    registrationAuthority: { type: String, required: true, trim: true},
    doctorName: { type: String, required: true, trim: true },
    doctorShortName: { type: String, required: false, trim: true },
    doctorDescription: { type: String, required: true, trim: true },
    activeFlag: { type: String, required: true, enum: ['Y', 'N'], default: 'Y' },
    speciality: [{
        specialityName: { type: String, required: true, trim: true }
    }],
    profilepicdir: { type: String, required: false, trim: true, default: 'medinovita/blankDoctor.png' },
    medinovitadoctorRating: {
        type: Number, required: true,
        min: [1, 'The value of path `{PATH}` ({VALUE}) is beneath the limit ({MIN}).'],
        max: [5, 'The value of path `{PATH}` ({VALUE}) exceeds the limit ({MAX}).'],
        default: 4

    },
    DoctorUserRating: [{
        userRating: {
            type: Number, required: true, //To get default rating for cost api
            min: [1, 'The value of path `{PATH}` ({VALUE}) is beneath the limit ({MIN}).'],
            max: [5, 'The value of path `{PATH}` ({VALUE}) exceeds the limit ({MAX}).'],
            default: 4
        },
        userId: { type: String, required: false, trim: true, default: 'medinovita@gmail.com' },
    }],
    updated_at: { type: Date, required: true, default: Date.now }
})

doctorSchema.pre('save', function (next) {
    var doctorShortName = this.doctorName;
    // console.log(hospdisplayname)
    this.doctorShortName = doctorShortName.replace(/\s+/g, '-').toLowerCase(); 
    this.doctorShortName = doctorShortName.replace(/\./g, '-').toLowerCase(); 
    next();
});


//create collection.
module.exports.doctorModel = mongoose.model(collection, doctorSchema);