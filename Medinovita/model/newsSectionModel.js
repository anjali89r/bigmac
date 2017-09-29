var mongoose = require('mongoose');
const collection = 'news_section';
var genericUtil = require('../controller/utilities/generic.js');
var Schema = mongoose.Schema;



var newsection = new Schema({

    
    newsId: { type: Number, required: true },
    postHeading: { type: String, required: true, trim: true },
    postedDate: { type: String, required: true },
    postedBy: { type: String, required: true, trim: true, default: 'Medinovita' },
    imgPath: { type: String, required: true, trim: true },
    postShortContent: { type: String, required: true, trim: true },
    newsDisableflag: { type: String, required: true, trim: true, enum: ['Y', 'N'], default: 'N' }
    
    
});

//create collection.
module.exports.newssectionModel = mongoose.model(collection, newsection);

















