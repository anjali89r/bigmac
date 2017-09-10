var mongoose = require('mongoose');
const collection = 'office_locations';
var Schema = mongoose.Schema;

/** **************/
var officelocationSchema = new Schema({

    country: { type: String, required: false, trim: true },
    officeCity: [{
        city: { type: String, required: true },
        officeLocation: [{
            addressLine1: { type: String, required: true, trim: true },
            addressLine2: { type: String, required: false, trim: true },
            officeType: { type: String, required: true, trim: true, enum: ['Commercial', 'HeadOffice', 'customerCare'], default: 'customerCare' },
            landMark: { type: String, required: true, trim: true },
            postCode: { type: Number, required: true, trim: true },
            officeEmailId: { type: String, required: true, trim: true },
            officeContactNumber: { type: Number, required: true, trim: true },
            contactPerson: { type: String, required: true, trim: true },
            officeTimings: { type: String, required: true },
        }],
    }]
});

module.exports.officeLocationModel = mongoose.model(collection, officelocationSchema);

















