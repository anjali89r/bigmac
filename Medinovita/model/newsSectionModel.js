var mongoose = require('mongoose');
const collection = 'news_section';
var genericUtil = require('../controller/utilities/generic.js');
var Schema = mongoose.Schema;



var newsection = new Schema({

  
    newsTitle: { type: String, required: true, trim: true },
    newsImagepath: { type: String, required: true, trim: true },
    newsContent: { type: String, required: true, trim: true },
    newsDisableflag: { type: String, required: true, trim: true, enum: ['Y', 'N'], default: 'N' }
    
    
});

//create collection.
module.exports.newssectionModel = mongoose.model(collection, newsection);

















