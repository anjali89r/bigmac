var mongoose = require('mongoose');
var Promise = require('promise');
var logger = require('../utilities/logger.js');
require('../../model/newsSectionModel.js');
var newsSectionModel = mongoose.model('news_section');

module.exports.addnewsSection = function (req, res) {

    if (res.headersSent) {//check if header is already returned
        logger.warn("Response already sent.Hence skipping the function call newsSection")
        return;
    }

    var newsSectionSchema = new newsSectionModel();

    new Promise(function (resolve, reject) {
           /* Initial Validation */
            if (req.body["newsTitle"] == null || req.body["newsImagepath"] == null || req.body["newsContent"] == null ) {
                logger.error("Mandatory fields are not supplied from GUI to update news section details");
                return reject(res.status(409).json({
                    "Message": "Mandatory fields are missing in the request"
                }));
            }          
            newsSectionSchema.newsTitle = req.body["newsTitle"],
                newsSectionSchema.newsImagepath = req.body["newsImagepath"],
                newsSectionSchema.newsContent = req.body["newsContent"],
                newsSectionSchema.newsDisableflag = req.body["newsDisableflag"]
                    resolve();
           
            })
        .then(function () {
            newsSectionSchema.save(function (error,data) {
                if (error) {
                    logger.error("Error saving news data to schema : - " + error.message)
                    return res.status(500).json({ "Message": error.message.trim() });
                }
                else {
                    return res.json({ "Message": "News Info got inserted successfully" });
                }
            })
        })
        .catch(function (err) {
            logger.error("Error while inserting news to schema: - " + err.message)
            return res.status(500).json({ "Message": err.message });
        })

}

module.exports.getnewsSection = function (req, res) {

    if (res.headersSent) {//check if header is already returned
        logger.warn("Response already sent.Hence skipping the function call get newsSection")
        return;
    }

    var newsSectionSchema = new newsSectionModel();

    
    newsSectionModel.aggregate([{"$match":{ "newsDisableflag": "N" }},
    {
        "$project": {
            "_id": 0,
            "newsContent": 1,
            "newsImagepath": 1,
            "newsTitle": 1
        }
    }
    ], function (err, result) {

        if (err) {
            logger.error("Error while reading list of latest news from DB");
            return res.status(500).json({ "Message": err.message.trim() });
        } else if (result == null) {
            logger.info("There are no latest news present in database");
            return res.status(200).json({ "Message": err.message.trim() });
        }
        else {
            return res.json(result);
        }
    })
}