var mongoose = require('mongoose');
require('mongoose-double')(mongoose);
require('mongoose-integer')(mongoose);
var autoIncrement = require('mongoose-auto-increment');

require('./hospitalDoctorDetailsModel.js');
var hopitalDoctorModel = mongoose.model('hospital_doctor_details');

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var SchemaTypes = mongoose.Schema.Types;

const collection = 'deal_offer_details';

var dealOffersSchema = new Schema({

    dealID: { type: Number, required: true, unique: true, dropDups: true, default: 0 },
    dealTreatmentname: {
        type: Number, required: true,
        validate: {
            validator: function (dealTreatmentname) {
                hopitalDoctorModel.findOne({ 'Treatment.name': dealTreatmentname }, function (err, result) {
                    if (result == null) return (false);
                    if (err) return (false);
                });
            },
            message: 'Procedure details are not added to hospital table.Please create entry in hospital table before deal'
        },
    },
    dealtreatmentID: {
        type: Number, required: true, unique: true, dropDups: true,

        validate: {
            validator: function (dealTreatmentname) {
                hopitalDoctorModel.findOne({ 'Treatment.name': dealTreatmentname, 'hospitalContact.City': dealHospitalCity, 'hospitalContact.country': dealHospitalCountry }, function (err, result) {
                    if (result == null) return (false);
                    if (err) return (false);
                });
            },
            message: 'Procedure details are not added to hospital table.Please create entry in hospital table before deal'
        },

        default: hopitalDoctorModel.find({ 'Treatment.name': dealTreatmentname, 'hospitalContact.City': dealHospitalCity, 'hospitalContact.country': dealHospitalCountry }, { "Treatment.procedureid": 1, "_id": 0 }, function (err, output) {
            if (err) return "Please insert values in hospital table"
        }),        
    }, 

    dealHospitalName: {
        type: String, required: true,
        validate: {
            validator: function (dealHospitalName) {
                hopitalDoctorModel.findOne({ 'hospitalName': dealHospitalName, 'hospitalContact.City': dealHospitalCity, 'hospitalContact.country': dealHospitalCountry }, function (err, result) {
                    if (result == null) return (false);
                    if (err) return (false);
                });
            },
            message: 'Hospital details are not added to hospital table.Please create entry in hospital table before deal'
        },
    },

    dealHospitalId: {
        type: Number, required: true, unique: true, dropDups: true,

        default: hopitalDoctorModel.find({ 'hospitalName': dealHospitalName, 'hospitalContact.City': dealHospitalCity, 'hospitalContact.country': dealHospitalCountry}, { "hospitalID": 1, "_id": 0 }, function (err, output) {
            if (err) return "Please insert values in hospital table"
        }),        
    },      
    dealHospitalCity: { type: String, required: true },
    dealHospitalCountry: { type: String, required: true },
    dealDoctorName: {
        type: String, required: true,
        validate: {
            validator: function (dealDoctorName) {
                hopitalDoctorModel.findOne({ 'hospitalName': dealHospitalName, 'Treatment.doctor.doctorName': dealDoctorName, 'hospitalContact.City': dealHospitalCity, 'hospitalContact.country': dealHospitalCountry }, function (err, result) {
                    if (result == null) return (false);
                    if (err) return (false);
                });
            },
            message: 'Doctor details are not added to hospital table.Please create entry in hospital table before deal'
        },                
    }, 
    dealDoctorId: {
        type: String, required: true,
        default: hopitalDoctorModel.find({ 'hospitalName': dealHospitalName, 'Treatment.doctor.doctorName': dealDoctorName, 'hospitalContact.City': dealHospitalCity, 'hospitalContact.country': dealHospitalCountry }, { "Treatment.doctor.doctorId": 1, "_id": 0 }, function (err, output) {
            if (err) return "Please insert values in hospital table"
        }),
    },
    dealActualcost: { type: Number, required: true, default: 0 },
    dealDiscountedcost: { type: Number, required: true, default: 0 },
    dealStartdate: { type: Date, required: true},
    dealEnddate: { type: Date, required: true },
})

//auto increment unique ids
dealOffersSchema.plugin(autoIncrement.plugin, { model: collection, field: 'dealID', startAt: 10000, incrementBy: 1 });

//create collection.
module.exports.User = mongoose.model(collection, dealOffersSchema);
