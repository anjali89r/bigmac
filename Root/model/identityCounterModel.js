var mongoose = require('mongoose');
//var autoIncrement = require('mongoose-plugin-autoinc');
var logger = require('../controller/utilities/logger.js');
var Schema = mongoose.Schema;

var collection = 'identitycounters';
var startCount = 10000;

var identityCounterSchema = new Schema({

    field: { type: String},
    model: { type: String},
    count: { type: Number}
})
module.exports.counterModel = mongoose.model(collection, identityCounterSchema, collection);

//query identity collection
module.exports.getNext = function (field, model, callback) {

        const nextPromise=new Promise((resolve, reject) => {

            var nextval = startCount;

            mongoose.model(collection, identityCounterSchema).find({ 'field': field, 'model': model }, { "count": 1, "_id": 0 }, function (err, result) {
                if ((typeof result[0] == 'undefined') || (typeof result[0] == null)) { //first time serverstartup identitycounter schema will not b there        
                    mongoose.model(collection, identityCounterSchema).field = field;
                    mongoose.model(collection, identityCounterSchema).model = model;
                    mongoose.model(collection, identityCounterSchema).count = startCount 
                    resolve(startCount)
                } else {
                    resolve( parseInt(result[0].count) + 1)
                }

            })
       
        }).
        then(function (count) {            
            mongoose.model(collection, identityCounterSchema).findOneAndUpdate({ 'field': field, 'model': model }, { $set: { "count": count } }, { returnOriginal: false, upsert: true }, function (err, doc) {
                callback(count);
            });
            
        }).
        catch(function (err) {
            logger.error( "Error while auto incrementing number - " + err.message)
            callback(nextval);
        });
}


