var mongoose = require('mongoose');
var Promise = require('promise');
var moment = require('moment');
var logger = require('../utilities/logger.js');
require('../../model/siteTrafficModel.js');
var counterSchema = require('../../model/identityCounterModel.js');
var siteTrafficModel = mongoose.model('site_traffic');

var collection = 'site_traffic';


module.exports.postsiteTraffic = function (req, res) {

    if (res.headersSent) {//check if header is already returned
        logger.warn("Response already sent.Hence skipping the function call post site traffic")
        return;
    }

    var siteTrafficSchema = new siteTrafficModel();
    

    new Promise(function (resolve, reject) {
        /* Initial Validation */
        if (req.body["browserType"] == null || req.body["sourceipAddress"] == null || req.body["datetimeAccessed"] == null ) {
            logger.error("Mandatory fields are not passed in the request. Please correct request");
            return reject(res.status(400).json({
                "Message": "Mandatory fields are missing in the request"
            }));
        }
        siteTrafficSchema.browserType = req.body["browserType"],
            siteTrafficSchema.sourceipAddress = req.body["sourceipAddress"],
            siteTrafficSchema.datetimeAccessed = req.body["datetimeAccessed"],
            siteTrafficSchema.country = req.body["country"]
            
        resolve();
    })
        .then(function () {
            siteTrafficSchema.save(function (error, data) {
                if (error) {
                    logger.error("Error saving site traffic to db : - " + error.message)
                    return res.status(500).json({ "Message": error.message.trim() });
                }
                else {
                    return res.json({ "Message": "Site traffic updated to DB" });
                }
            })
        })
        .catch(function (err) {
            logger.error("Error while inserting new sections to schema: - " + err.message)
            return res.status(500).json({ "Message": err.message });
        })

}