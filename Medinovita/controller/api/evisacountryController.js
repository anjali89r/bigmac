var mongoose = require('mongoose');
var Promise = require('promise');
var moment = require('moment');
var logger = require('../utilities/logger.js');
require('../../model/eVisacountryModel.js');

var evisacountry = mongoose.model('evisacountries');

var collection = 'evisacountries';


module.exports.getevisacountry = function (req, res) {

    
    var evisacountrySchema = new evisacountry();

    if (!req.params.countryName  || req.params.countryName == "null")
    {
        return res.status(400).json({ "Message": "Please provide a valid country name to get details" });
    }

    evisacountry.aggregate([
        { "$project": { "_id": 0, "countrylist.country": 1, "countrylist.fee": 1, "countrylist.disabled": 1 } }

    ], function (err, result) {

        if (err) {
            logger.error("Error while reading visacountry details " + err.message.trim());
            return res.status(500).json({ "Message": "Error in getting the evisacountry details"});
        } 
        else {
            //console.log(result[0].countrylist);
            var filterresult = result[0].countrylist.filter(function (el)
            {
                if (req.params.countryName === "all")
                    return el.disabled == false;
                else if (!req.params.countryName)
                    console.log(req.params.countryName)
                    return el.disabled == false && el.country == req.params.countryName

            })
            return res.json(filterresult);
        }
    })

}