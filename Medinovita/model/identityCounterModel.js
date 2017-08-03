var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var logger = require('../controller/utilities/logger.js');
var Schema = mongoose.Schema;

var collection = 'identitycounters';

var identityCounterSchema = new Schema({

    field: { type: String},
    model: { type: String},
    count: { type: Number}
})
module.exports.counterModel = mongoose.model(collection, identityCounterSchema, collection);

//query identity collection
module.exports.getNext = function (field, model, callback) {

    mongoose.model(collection, identityCounterSchema).find({ 'field': field, 'model': model }, { "count": 1, "_id": 0 }, function (err, result) {                
        if (err) callback(10000)
        if ((typeof result[0] == 'undefined') || (typeof result[0] == null)) callback(10000) //first time serverstartup identitycounter schema will not b there        
        callback ( (parseInt(result[0].count) + 1));
    });
}


