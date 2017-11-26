var mongoose = require('mongoose');
var Promise = require('promise');
var logger = require('../utilities/logger.js');
require('../../model/aboutMedicalModel.js');
require('../../model/highlightSectionModel.js');
require('../../model/featuredTreatmentModel.js');
var aboutMedicalModel = mongoose.model('medical_section');
var highlightSectionModel = mongoose.model('highlight_section');
var featuredTreatmentModel = mongoose.model('featured_treatment');
var counterSchema = require('../../model/identityCounterModel.js');


/************************/
module.exports.getFeaturedtreatments = function (req, res) {

    if (res.headersSent) {//check if header is already returned
        logger.warn("Response already sent.Hence skipping the function call getFeaturedtreatments")
        return;
    }

    try{

        featuredTreatmentModel.find({}, {_id:0},function (err, result) {
            if (err) {
                logger.error("Error retrieving the records from DB : - " + err.message)
                return res.status(500).json({ "Message": err.message });
            }
            return res.status(200).json(result.sort());

        });
    }
    catch (err) {

        return res.status(500).json(err.message);

    }


}


module.exports.getaboutMedicalsection = function (req, res) {

    if (res.headersSent) {//check if header is already returned
        logger.warn("Response already sent.Hence skipping the function call getaboutMedicalsection")
        return;
    }
    try {

        aboutMedicalModel.findOne({}, {_id:0},function (err, result) {
            if (err) {
                logger.error("Error retrieving the records from DB : - " + err.message)
                return res.status(500).json({ "Message": err.message });
            }
            return res.status(200).json(result);

        });
    }
    catch (err) {

        return res.status(500).json(err.message);

    }


}


module.exports.gethighlightsection = function (req, res) {

    if (res.headersSent) {//check if header is already returned
        logger.warn("Response already sent.Hence skipping the function call gethighlightsection")
        return;
    }
    let limit = parseInt(req.query.limit);
    try {

        highlightSectionModel.find({}, { _id: 0 }, { limit: limit }, function (err, result) {
            if (err) {
                logger.error("Error retrieving the records from DB : - " + err.message)
                return res.status(500).json({ "Message": err.message });
            }
            return res.status(200).json(result);

        });
    }
    catch (err) {

        return res.status(500).json(err.message);

    }


}

module.exports.addFeaturedtreatments = function (req, res) {
    if (res.headersSent) {//check if header is already returned
        logger.warn("Response already sent.Hence skipping the function call addFeaturedtreatments")
        return;
    }
    try {


        if (Array.isArray(req.body)) {
            // Console.log(req.body);
            for (var arrIndex = 0; arrIndex < req.body.length; arrIndex++)
            {
                if (req.body[arrIndex].img == null)
                    {
                    logger.error("Error while adding the record : - img path cannot be null")
                    return res.status(400).json({ "Message": "img path cannot be null for array index " + arrIndex });
                    }
                if (req.body[arrIndex].svgImg == null) {
                        logger.error("Error while adding the record : - svgImg path cannot be null")
                        return res.status(400).json({ "Message": "svgImg path cannot be null for array index " + arrIndex });
                    }
                if (req.body[arrIndex].shortContent == null) {
                        logger.error("Error while adding the record : - shortContent cannot be null")
                        return res.status(400).json({ "Message": "shortContent cannot be null for array index " + arrIndex });
                    }
                if (req.body[arrIndex].title == null) {
                        logger.error("Error while adding the record : - title cannot be null")
                        return res.status(400).json({ "Message": "title cannot be null for array index " + arrIndex });
                    }

            }
            featuredTreatmentModel.insertMany()

        }
        else
        {
            logger.error("Request is not an array.")
            return res.status(400).json({ "Message": "Request is not an array.Please correct request format" });

        }


    }
    catch (err) {

        return res.status(500).json(err.message);

    }


}
