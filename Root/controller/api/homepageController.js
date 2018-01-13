var mongoose = require('mongoose');
var Promise = require('promise');
var logger = require('../utilities/logger.js');
require('../../model/homepageModel.js');
var homepageModel = mongoose.model('homepage_collection');

module.exports.addHomepagedetails = function (req, res) {

    if (res.headersSent) {//check if header is already returned
        logger.warn("Response already sent.Hence skipping the function call addServicedetails")
        return;
    }

    var homePageSchema = new homepageModel();

    new Promise(function (resolve, reject) {
           /* Initial Validation */
        if (req.body["customerCareno"] == null || req.body["whatsappCustomercareno"] == null || req.body["fburlLink"] == null || req.body["twitterurlLink"] == null || req.body["linkedlinurlLink"] == null || req.body["instagramurlLink"] == null || req.body["whyIndiaDesc"] == null || req.body["whymedinovitaDesc"] == null) {
                logger.error("Mandatory fields are not passed in the request. Please correct request");
                return reject(res.status(400).json({
                    "Message": "Mandatory fields are missing in the request"
                }));
            }          
            homePageSchema.customerCareno = req.body["customerCareno"],
            homePageSchema.whatsappCustomercareno = req.body["whatsappCustomercareno"],
            homePageSchema.fburlLink = req.body["fburlLink"],
            homePageSchema.twitterurlLink = req.body["twitterurlLink"],
                homePageSchema.linkedlinurlLink = req.body["linkedlinurlLink"],
                homePageSchema.instagramurlLink = req.body["instagramurlLink"],
                homePageSchema.whyIndiaDesc = req.body["whyIndiaDesc"],
                homePageSchema.whymedinovitaDesc = req.body["whymedinovitaDesc"]
                    resolve();           
            })
        .then(function () {
            homePageSchema.save(function (error, data) {
                if (error) {
                    logger.error("Error saving home page details data to schema : - " + error.message)
                    return res.status(500).json({ "Message": error.message.trim() });
                }
                else {
                    return res.json({ "Message": "Home page details are updated to DB" });
                }
            })
        })
        .catch(function (err) {
            logger.error("Error while inserting home page details to schema: - " + err.message)
            return res.status(500).json({ "Message": err.message });
        })

}

module.exports.getHomepagedetails = function (req, res) {

    if (res.headersSent) {//check if header is already returned
        logger.warn("Response already sent.Hence skipping the function call get service section")
        return;
    }

    var homePageSchema = new homepageModel();

    homepageModel.aggregate([
        { "$project": { "_id": 0, "customerCareno": 1, "whatsappCustomercareno": 1, "fburlLink": 1, "twitterurlLink": 1, "linkedlinurlLink": 1, "instagramurlLink": 1, "whyIndiaDesc": 1, "whymedinovitaDesc": 1} }
        
    ], function (err, result) {

        if (err) {
            logger.error("Error while reading home page details from DB");
            return res.status(500).json({ "Message": err.message.trim() });
        } else if (result == null) {
            logger.info("There is no home page details available in DB");
            return res.status(400).json({ "Message": err.message.trim() });
        }
        else {
            return res.json(result);
        }
    })
}