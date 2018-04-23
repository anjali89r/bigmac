var mongoose = require('mongoose');
var Promise = require('promise');
var moment = require('moment');
var logger = require('../utilities/logger.js');
require('../../model/newsSectionModel.js');
var counterSchema = require('../../model/identityCounterModel.js');
var newsSectionModel = mongoose.model('news_section');

var collection = 'news_section';



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
            "newsId": 1,
            "postedDate": 1,
            "postedBy": 1,
            "postHeading": 1,
            "imgPath": 1,
            "postShortContent":1
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


module.exports.addnewsSection = function (req, res) {

    if (res.headersSent) {//check if header is already returned
        logger.warn("Response already sent.Hence skipping the function call addServicedetails")
        return;
    }
    
    var today = new moment().format("D MMM, YYYY");
    //var newsId = 1;

    var newsSectionSchema = new newsSectionModel();

    
  
    new Promise(function (resolve, reject) {
        /* Initial Validation */
        if (req.body["postHeading"] == null ||  req.body["imgPath"] == null || req.body["postShortContent"] == null || req.body["newsDisableflag"] == null ) {
            logger.error("Mandatory fields are not passed in the request. Please correct request");
            return reject(res.status(400).json({
                "Message": "Mandatory fields are missing in the request"
            }));
        }
       
            counterSchema.getNext('newsId', collection, function (id) {

                // console.log("id value is " + newsId);
                resolve(id);
            })
        
       
    })
        .then(function (newsId) {
            newsSectionSchema.newsId = newsId,
                newsSectionSchema.postedBy = 'Medinovita',
                newsSectionSchema.postedDate = today,
                newsSectionSchema.postHeading = req.body["postHeading"],
                newsSectionSchema.imgPath = req.body["imgPath"],
                newsSectionSchema.postShortContent = req.body["postShortContent"],
                newsSectionSchema.newsDisableflag = req.body["newsDisableflag"],
                newsSectionSchema.newDescription = req.body["newDescription"]
            newsSectionSchema.save(function (error, data) {
                if (error) {
                    logger.error("Error saving new sections details data to schema : - " + error.message)
                    return res.status(500).json({ "Message": error.message.trim() });
                }
                else {
                    return res.status(201).json({ "Message": "New Sections are updated to DB" });
                }
            })
        })
        .catch(function (err) {
            logger.error("Error while inserting new sections to schema: - " + err.message)
            return res.status(500).json({ "Message": err.message });
        })

}


module.exports.getnewsSectiontemplate = getnewsSectiontemplate

function getnewsSectiontemplate(newsid,next) {
    
        var newsSectionSchema = new newsSectionModel();
        
   //  console.log(newsid)
        //newsSectionModel.aggregate([{ "$match": { "newsId": parseInt(newsid) } },
        newsSectionModel.aggregate([{"$match":{ "newsDisableflag": "N" }},
        {
            "$project": {
                "_id": 0,
                "newsId": 1,
                "postHeading":1,
                
                "newDescription": 1,
                "imgPath" : 1,
                "postedDate": 1
    
               
            }
        }
        ], function (err, result) {
    
            if (err) {
                logger.error("Error while reading list of latest news from DB");
                next(null);
                
            } else if (result == null) {
                logger.info("There are no news available in db for the newsid");
                next(null);
            }
            else {
              //  console.log(result)
                
               next(result);
            }
        })
    }