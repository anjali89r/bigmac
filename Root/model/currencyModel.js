var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const collection = 'Currency_Convertion_Details';

var currencySchema = new Schema({    
    currencydata: [{
        currency: { type: String, required: true, trim: true },
        symbol: { type: String, required: true, trim: true},
        conversionrate: { type: String, required: true, trim: true },       
    }]
})

//create collection.
module.exports.currencyModel = mongoose.model(collection, currencySchema);
