var mongoose = require('mongoose');
var Promise = require('promise');
var moment = require('moment');
var logger = require('../utilities/logger.js');
require('../../model/eVisacountryModel.js');

var evisacountry = mongoose.model('evisacountries');

var collection = 'evisacountries';
module.exports.getevisacountry = function (req, res) {

    var country = req.params.countryName

    getevisaDetails(country, function (visaCost) {

        return res.json(visaCost)
    })

}
/*modified the function to access fee in cost page */
module.exports.getevisaDetails = getevisaDetails
function getevisaDetails(countryName, callback) {

    var evisacountrySchema = new evisacountry();
    if (!countryName || countryName == null) {
        callback({ "Message": "Please provide a valid country name to get details" });
    }

    evisacountry.aggregate([
        { "$project": { "_id": 0, "countrylist.country": 1, "countrylist.fee": 1, "countrylist.disabled": 1 } }

    ], function (err, result) {        
        if (err) {
            logger.error("Error while reading visacountry details " + err.message.trim());
            callback({ "Message": "Error in getting the evisacountry details" });
        }
        else {           
            var filterresult = result[0].countrylist.filter(function (el) {
                if (countryName === "all")
                    return el.disabled == false;
                else if (!countryName)                
                    return el.disabled == false && el.country == countryName
                else if (countryName)  
                    return el.disabled == false && el.country == countryName
            })           
            callback(filterresult);            
        }
    })
}

/* API to add or update evisa fee */
module.exports.addorUpdateEvisaFee = function (req, res) {

    if (res.headersSent) {//check if header is already returned
        logger.warn("Response already sent.Hence skipping the function call addorUpdateEvisaFee")
        return;
    }

    var evisacountrySchema = new evisacountry();

    new Promise(function (resolve, reject) {

        //check if procedure cost for a country is already stored in table
        evisacountry.findOne(
            { "countrylist": { $elemMatch: { "country": req.body['country'] } } }, function (err, doc) {
                if (doc !== null && doc.fee != null) {
                    logger.warn("evisa cost for " + req.body['country'] + " already exists in database");
                    resolve(false)  //update                     
                } else {
                    resolve(true)  //add record 
                }
            })
    }).then(function (flag) {

        //add new record
        if (flag == true) {
            evisacountrySchema.countrylist = [{
                id: req.body['id'],
                country: req.body['country'],
                fee: req.body['fee'],
                disabled: req.body["disabled"]
            }]

            evisacountrySchema.save(function (error) {
                if (error) {
                    logger.error("Error while inserting record in evisa country collection: - " + error.message)
                    return res.status(500).json({ "Message": error.message.trim() });
                }
                else {
                    return res.json({ "Message": "Data got inserted successfully in evisacountries collection" });
                }
            })

        } else {//update fee
            evisacountrySchema.findOneAndUpdate(
                {
                    "countrylist": { $elemMatch: { "country": req.body['country'] } }
                },
                {
                    "$push": {
                        "countrylist": {
                            "id": req.body['id'],
                            "country": req.body['country'],
                            "fee": req.body['fee'],
                            "disabled": req.body["disabled"]
                        }
                    }
                },
                { new: true }, function (err, doc) {
                    if (err) {
                        logger.error("Error while updating record : - " + err.message);
                        return res.status(409).json({
                            "Message": "Error while updating evisa fee for " + req.body['country'] + " in evisaCountries collection"
                        });
                    } else if (doc === null) {
                        logger.error("Error while updating record : - unable to update evisacountries database");
                        return res.status(409).json({
                            "Message": "Error while adding new fee record for " + req.body['country'] + err.message
                        });
                    } else {
                        return res.json({ "Message": "Data got updated successfully in evisacountries collection" });
                    }
                });
        }

    }).catch(function (err) {
        return res.json({ "Message": err.message });
    });

}

/* Get list of unique country and isd codes */   
module.exports.getCountryListNCode = function (req, res) {

    if (res.headersSent) {//check if header is already returned
        logger.warn("Response already sent.Hence skipping the function call getCountryListNCode")
        return;
    }  

    getCountryList(function (result) {
        return res.json({ result })
    })
}
function getCountryList(next) {

    evisacountry.aggregate([
        {
            "$match":  { "countrylist.disabled": false }
        },
        { "$project": { "_id": 0, "countrylist.country": 1, "countrylist.dial_code": 1, "countrylist.code": 1 } }

    ], function (err, result) {

        if (err) {
            logger.error("Error while fetching country list from evisa table");
            next(null)
        } else if (!result.length) {
            logger.error("There are no country list available in table");
            next(null)
        } else {
            next(result)
        }
    })
}

