var mongoose = require('mongoose');
var Promise = require('promise');
var logger = require('../utilities/logger.js');
require('../../model/currencyModel.js');
var currencyModel = mongoose.model('Currency_Convertion_Details')

var collection = 'Currency_Convertion_Details'; 

/*get conversion rate for a currency */
module.exports.getConversionRate = getConversionRate;
function getConversionRate(currency, next) {

    currencyModel.aggregate([
        { "$project": { "_id": 0, "currencydata.currency": 1, "currencydata.symbol": 1, "currencydata.conversionrate": 1 } }

    ], function (err, result) {
        if (err) {
            logger.error("Error while reading currency conversion details " + err.message.trim());
            next(null);
        }
        else {
            
            var filterresult = result[0].currencydata.filter(function (el) {
                return el.currency == currency                
            })
            next(filterresult);
        }
    })
}

module.exports.addorUpdateCurrencydata = function (req, res) {

    if (res.headersSent) {//check if header is already returned
        logger.warn("Response already sent.Hence skipping the function call addorUpdateCurrencydata")
        return;
    }

    var currencySchema = new currencyModel();

    new Promise(function (resolve, reject) {

        //check if procedure cost for a country is already stored in table
        currencyModel.findOne(
            { "currencydata": { $elemMatch: { "currency": req.body['currency'] } } }, function (err, doc) {
                if (doc !== null && doc.currency != null) {
                    logger.warn("Currency info for  " + req.body['currency'] + " already exists in database");
                    resolve(false)  //update                     
                } else {
                    resolve(true)  //add record 
                    logger.info("Currency info for  " + req.body['currency'] + " does not exists in database");
                }
            })
    }).then(function (flag) {

        //add new record
        if (flag == true) {
            
            currencyModel.find({
                "currencydata.currency": { "$exists": true }
            }, function (err, docs) {
                
                if (err) {
                    return res.status(500).json({ "Message": "Error while inserting documents to currency model" });
                } else if (typeof docs != "undefined" && docs != null && docs.length != null && docs.length > 0) {
                    //update items to existing array
                    currencyModel.update({                       
                    }, {
                            $push: {
                                "currencydata": {
                                    currency: req.body['currency'],
                                    symbol: req.body['symbol'],
                                    conversionrate: req.body['conversionrate']
                                }
                            }
                        }, function (err, doc) {
                            if (err) {
                                return res.status(500).json({ "Message": "Error while inserting documents to currency model" });
                                logger.error("Error while inserting documents to currency model - " + err.message)
                            } else {
                                logger.info("Successfully added " + req.body['currency'] + " in to currency model")
                                return res.status(202).json({ "Message": "Successfully added " + req.body['currency'] + " in to currency model"});
                            }

                        })

                } else {                     
                      currencySchema.currencydata = [{
                            currency: req.body['currency'],
                            symbol: req.body['symbol'],
                            conversionrate: req.body['conversionrate']
                        }]
                        
                        currencySchema.save(function (error) {
                            if (error) {
                                logger.error("Error while inserting record in currency data collection: - " + error.message)
                                return res.status(500).json({ "Message": error.message.trim() });
                            }
                            else {
                                return res.status(201).json({ "Message": "Data got inserted successfully in currency data collection" });
                            }
                        })
                }

            })

        } else {//update fee
            currencySchema.findOneAndUpdate(
                {
                    "currencydata": { $elemMatch: { "currency": req.body['currency'] } } 
                },
                {
                    "$push": {
                        "currencydata": {
                            "currency": req.body['currency'],
                            "symbol": req.body['symbol'],
                            "conversionrate": req.body['conversionrate']
                        }
                    }
                },
                { new: true }, function (err, doc) {
                    if (err) {
                        logger.error("Error while updating record in currency details : - " + err.message);
                        return res.status(409).json({
                            "Message": "Error while updating currency conversion data for " + req.body['currency'] + " in currency conversion collection"
                        });
                    } else if (doc === null) {
                        logger.error("Error while updating record : - unable to update currency conversion database");
                        return res.status(409).json({
                            "Message": "Error while updating currency record for " + req.body['currency'] + err.message
                        });
                    } else {
                        return res.status(201).json({ "Message": "Data got updated successfully in currency conversion collection" });
                    }
                });
        }

    }).catch(function (err) {
        return res.status(500).json({ "Message": err.message });
    });

}
