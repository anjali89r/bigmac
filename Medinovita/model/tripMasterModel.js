var mongoose = require('mongoose');
require('mongoose-double')(mongoose);
require('mongoose-integer')(mongoose);
var autoIncrement = require('mongoose-auto-increment');
var counterSchema = require('./identityCounterModel.js');
var genericUtil = require('../controller/utilities/generic.js');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var SchemaTypes = mongoose.Schema.Types;

const collection = 'trip_master';

// Order sub document this is an array in main document
var orderSchema = new Schema({
    tripId: { type: Number, required: false, unique: true, dropDups: true, default: 10000 },
    tripEventid: { type: Number, required: false, unique: true, dropDups: true, default: 10000 },
    subject: { type: String, required: false, trim: true },
    date: { type: Date, required: false },
    description: { type: String, required: false, trim: true },
    quantity: { type: Number, required: false },
    assignedTo: { type: String, required: false, trim: true },
    cost: { type: Number, required: false },
    paymentStatus: { type: String, required: true, trim: true, enum: ['YET_TO_START', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'] },
    shippedStatus: { type: String, required: true, trim: true, enum: ['YET_TO_START', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'] },
    deliveryStatus: { type: String, required: true, trim: true, enum: ['YET_TO_START', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'] },
    shippingCouriername: { type: String, required: false, trim: true },
    shippingCouriertrackingId: { type: String, required: false, trim: true }


});
// MiscFacility sub document this is a single nested subdoc
var miscFacilitySchema = new Schema({
    id: { type: Number, required: false, unique: true, dropDups: true, default: 10000 },
    name: { type: String, required: false, trim: true },
    description: { type: String, required: false, trim: true },
    cost: { type: Number, required: false }
});
// Payment details sub document this is array nest sub doc
var transactionSchema = new Schema({
    eventId: { type: Number, required: false, unique: true, dropDups: true, default: 10000 },
    transactionId: { type: Number, required: false, unique: true, dropDups: true, default: 10000 },
    transactionName: { type: String, required: false, trim: true },
    transactionDate: { type: Date, required: false },
    transactionAmount: { type: Number, required: false },
    paymentGateway: { type: String, required: false, trim: true },
    paymentStatus: { type: String, required: false, trim: true }

});
// Holiday sub document this is a single nested subdoc
var holidaySchema = new Schema({
    eventId: { type: Number, required: false, unique: true, dropDups: true, default: 10000 },
    packageId: { type: Number, required: false, unique: true, dropDups: true, default: 10000 },
    isHolidayopted: { type: String, required: true, trim: true, enum: ['Y', 'N'] },
    holidayPriortotreatment: { type: String, required: false, trim: true, enum: ['Y', 'N'] },
    holidayPosttreatment: { type: String, required: false, trim: true, enum: ['Y', 'N'] },
    startDate: { type: Date, required: false },
    endDate: { type: Date, required: false },
    totalCost: { type: Number, required: false },
    transportCost: { type: Number, required: false }


});
// Hotel sub document this is a single nested subdoc
var hotelSchema = new Schema({
    eventId: { type: Number, required: false, unique: true, dropDups: true, default: 10000 },
    hotelId: { type: Number, required: false, unique: true, dropDups: true, default: 10000 },
    hotelName: { type: String, required: false, trim: true },
    hotelnoOfroomsbooked: { type: Number, required: false },
    hotelnoOfadditionalbeds: { type: Number, required: false },
    hotelextraBedcost: { type: Number, required: false },
    hotelcheckIndate: { type: Date, required: false },
    hotelcheckOutdate: { type: Date, required: false },
    hotelExpense: { type: Number, required: false }
});
// Hospital sub document this is a single nested subdoc
var hospitalSchema = new Schema({
    eventId: { type: Number, required: false, unique: true, dropDups: true, default: 10000 },
    procedureId: { type: Number, required: false, unique: false, dropDups: false },
    procedureDocId: { type: Number, required: false, unique: false, dropDups: false },
    hospitalId: { type: Number, required: false, unique: false, dropDups: false },
    admissionDate: { type: Date, required: false },
    dischargeDate: { type: Date, required: false },
    hospitalExpense: { type: Number, required: false }
});
// LocalTransport sub document this is an array nested subdoc
var localtransportSchema = new Schema({
    eventId: { type: Number, required: false, unique: true, dropDups: true, default: 10000 },
    providerId: { type: Number, required: false, unique: true, dropDups: true, default: 10000 },
    providerName: { type: String, required: false, trim: true },
    pickupDatetime: { type: Date, required: false },
    dropDatetime: { type: Date, required: false },
    pickupPlace: { type: String, required: false, trim: true },
    dropPlace: { type: String, required: false, trim: true },
    driverName: { type: String, required: false, trim: true },
    driverContactnumber: { type: Number, required: false },
    transportExpense: { type: Number, required: false }
});
// Itinerary sub document this is a single nested subdoc
var itinerarySchema = new Schema({
    tripeventid: { type: Number, required: false, unique: true, dropDups: true, default: 10000 },
    onwardFlightstatus: { type: String, required: false, trim: true, enum: ['BOOKED', 'YET_TO_BE_BOOKED'] },
    onwardFlightbookingCost: { type: Number, required: false },
    onwardFlightname: { type: String, required: false, trim: true },
    onwardFlightnumber: { type: String, required: false, trim: true },
    onwardflightStartdate: { type: Date, required: false },
    onwardflightarrivaldate: { type: Date, required: false },
    onwardFlightpnrno: { type: String, required: false, trim: true },

    returnFlightstatus: { type: String, required: false, trim: true, enum: ['BOOKED', 'YET_TO_BE_BOOKED'] },
    returnFlightbookingCost: { type: Number, required: false },
    returnFlightname: { type: String, required: false, trim: true },
    returnFlightnumber: { type: String, required: false, trim: true },
    returnFlightstartDate: { type: Date, required: false },
    returnFlightarrivalDate: { type: Date, required: false },
    returnFlightpnrno: { type: String, required: false, trim: true },
    flightBookinghelprequested: { type: String, required: false, trim: true, enum: ['Y', 'N'] }

});
//Trip master subdocument
var tripMasterSchema = new Schema({

    tripPatientId: { type: Number, required: false, unique: false, dropDups: false },
    tripDoctorid: { type: Number, required: false, unique: false, dropDups: false},
    tripcaseManagerid: { type: Number, required: false, unique: false, dropDups: false },
    tripDepartmentid: { type: Number, required: false, unique: false, dropDups: false },
    tripProcedureid: { type: Number, required: false, unique: false, dropDups: false },
    tripStartdate: { type: Date, required: false },
    tripEnddate: { type: Date, required: false },
    tripBystandercount: { type: Number, required: false, unique: false, dropDups: false },
    tripInitiatedby: { type: String, required: true, trim: true, enum: ['PATIENT', 'AGENT', 'MEDINOVITA'] },
    tripHoteltype: { type: Number, required: false, unique: false, dropDups: false },

    tripHotelname: { type: String, required: false, trim: true },
    tripHotelid: { type: Number, required: false, unique: false, dropDups: false },
    tripTransporttypeid: { type: Number, required: false, unique: false, dropDups: false },
    tripCaseDescription: { type: String, required: false, trim: true },
    tripPercentageCompletion: { type: Number, required: false, unique: false, dropDups: false },
    tripStatus: { type: String, required: true, trim: true, enum: ['IN_PROGRESS', 'INITIATED', 'PENDING_USER', 'PENDING_CM', 'PENDING_AGENT', 'COMPLETED'] },
    medicalHistoryfilename: { type: String, required: false, trim: true },
    medicalHistoryfilepath: { type: String, required: false, trim: true },
    tripFeedbackdisplaypic: { type: String, required: true, trim: true, enum: ['Y', 'N'] },
    tripVisastatus: { type: String, required: true, trim: true, enum: ['READY', 'IN_PROGRESS','NOT_STARTED'] },
    visahelpRequired: { type: String, required: true, trim: true, enum: ['Y', 'N'] },
    tripHospitalexpense: { type: Number, required: false, unique: false, dropDups: false },
    tripTravelexpense: { type: Number, required: false, unique: false, dropDups: false },
    tripAccomadationexpense: { type: Number, required: false, unique: false, dropDups: false },
    tripNoofdaysstay: { type: Number, required: false, unique: false, dropDups: false },
    tripMiscamnity: { type: Number, required: false, unique: false, dropDups: false },
    tripMiscexpense: { type: Number, required: false, unique: false, dropDups: false },
    tripDoctorcomments: { type: String, required: false, trim: true },

    itinerary: itinerarySchema ,
    localTransport: [localtransportSchema],
    hospital: hospitalSchema,
    hotel: hotelSchema,
    holiday: holidaySchema,
    paymentDetails: [transactionSchema],
    miscFacility: miscFacilitySchema,
    order: [orderSchema]
});





//increase the value of files using autoIncrement plugin
tripMasterSchema.plugin(autoIncrement.plugin, { model: collection, field: 'tripId',startAt: 10000,incrementBy: 1});


//create collection.
module.exports.tripMasterModel = mongoose.model(collection, tripMasterSchema);


