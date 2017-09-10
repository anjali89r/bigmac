var mongoose = require('mongoose');
var logger = require('../utilities/logger.js');
require('../../model/officeLocationModel.js');
var officeLocationModel = mongoose.model('office_locations');
var officeLocationSchema = new officeLocationModel();

/************************ API code to read office locations ****************************/
module.exports.getOfficeLocations = function (req, res) {

    if (res.headersSent) {//check if header is already returned
        logger.warn("Response already sent.Hence skipping the function call getOfficeLocations")
        return;
    }  

    officeLocationModel.aggregate([
       /* {
            "$match": {
                officeCity: { $exists: true }
            }
        },*/
        {
            "$project": {
                "_id": 0,
                "country": 1,
                "officeCity": {                    
                    "$map": {
                        "input": "$officeCity",
                        "as": "offcity",
                        "in": {
                            "$ifNull":[ //"$cond": [//specify the filter here                               
                                {
                                    "city": "$$offcity.city",
                                    "officeLocation": {

                                        "$map": {
                                            "input": "$$offcity.officeLocation",
                                            "as": "offLoc",
                                            "in": {
                                                "$ifNull": [ // "$cond": [{"$eq": ["$$enquiry.userFullName", "Libin Sebastian new"] }}] - array filter if required                                                   
                                                    {
                                                        "addressLine1": "$$offLoc.addressLine1", "addressLine2": "$$offLoc.addressLine2", "officeType": "$$offLoc.officeType",
                                                        "landMark": "$$offLoc.landMark", "officeEmailId": "$$offLoc.officeEmailId", "officeEmailId": "$$offLoc.officeContactNumber",
                                                        "contactPerson": "$$offLoc.contactPerson", "contactPerson": "$$offLoc.officeTimings"
                                                    },
                                                    false
                                               ],
                                            },//"in": {
                                        },//"$map": {
                                    },//"officeLocation": {
                                },
                                false
                            ]
                        }
                    }
                }
            }
        }
    ], function (err, result) {

        if (err) {
            logger.error("Error while reading list of office address");
            return res.status(500).json({ "Message": err.message.trim() });
        } else if (result == null) {
            logger.info("There are no office address present in database");
            return res.status(200).json({ "Message": err.message.trim() });
        }
        else {
            return res.json(result);
        }
    })
}
/************************ API code to add office locations ****************************/
module.exports.addOfficeLocations = function (req, res) {

    if (res.headersSent) {//check if header is already returned
        logger.warn("Response already sent.Hence skipping the function call addOfficeLocations")
        return;
    } 

    new Promise(function (resolve, reject) {

        checkCityandCountry(req, function (doc) {

            var countryFound = doc.split(/\|/)[0];
            var cityFound = doc.split(/\|/)[1];

            /* Initial Validation */
            if (req.body["country"] == null || req.body["city"] ==null|| req.body["addressLine1"] == null || req.body["postCode"] == null) {
                logger.error("Mandatory fields are not supplied from GUI to update locations details");
                return reject(res.status(409).json({
                    "Message": "Mandatory fields are missing in the request"
                }));
            }

            if (countryFound=='false' && cityFound=='false' ) { /* If it's the first location */
                /* update country and city */
                officeLocationSchema.country = req.body["country"],
                    officeLocationSchema.officeCity = [{
                        city: req.body["city"],
                            officeLocation : [{
                            addressLine1: req.body["addressLine1"],
                            addressLine2: req.body["addressLine2"],
                            officeType: req.body["officeType"],
                            landMark: req.body["landMark"],
                            postCode: parseInt(req.body["postCode"]),
                            officeEmailId: req.body["officeEmailId"],
                            officeContactNumber: parseInt(req.body["officeContactNumber"]),
                            contactPerson: req.body["contactPerson"],
                            officeTimings: req.body["officeTimings"],
                        }]
                    }]
                resolve()           
            } else if (countryFound=='true' && cityFound=='false' ) {  

                officeLocationModel.findOneAndUpdate({
                    "country": req.body["country"]},
                {
                    "$push": {
                       "officeCity" : {
                            "city": req.body["city"],
                            "officeLocation": {
                            "addressLine1": req.body["addressLine1"],
                            "addressLine2": req.body["addressLine2"],
                            "officeType": req.body["officeType"],
                            "landMark": req.body["landMark"],
                            "postCode": parseInt(req.body["postCode"]),
                            "officeEmailId": req.body["officeEmailId"],
                            "officeContactNumber": parseInt(req.body["officeContactNumber"]),
                            "contactPerson": req.body["contactPerson"],
                            "officeTimings": req.body["officeTimings"],
                        },
                    }
                  }
                },
                { returnOriginal: false, upsert: true }, function (err, doc) {
                    if (err) {
                        logger.error("Error while updating record : - " + err.message);
                        return reject(res.status(409).json({
                            "Message": "Error while adding office address in country " + req.body["country"] + " and city " + req.body["city"]  + " in user office locations collection"
                        }));
                    } else if (doc === null) {
                        logger.error("Error while updating record : - unable to update office location database");
                        return reject(res.status(409).json({
                            "Message": "Error while adding new office location due to " + err.message
                        }));
                    }
                    resolve();
                });
            } else {//if (countryFound == true && cityFound == true)

                officeLocationModel.findOneAndUpdate({
                    "country": req.body["country"], "officeCity": { $elemMatch: { "city": req.body["city"] } }
                },
                    {
                        "$push": {
                            "officeCity.$.officeLocation": {
                                "addressLine1": req.body["addressLine1"],
                                "addressLine2": req.body["addressLine2"],
                                "officeType": req.body["officeType"],
                                "landMark": req.body["landMark"],
                                "postCode": parseInt(req.body["postCode"]),
                                "officeEmailId": req.body["officeEmailId"],
                                "officeContactNumber": parseInt(req.body["officeContactNumber"]),
                                "contactPerson": req.body["contactPerson"],
                                "officeTimings": req.body["officeTimings"],
                            }
                        }
                    },
                    { returnOriginal: false, upsert: true }, function (err, doc) {
                        if (err) {
                            logger.error("Error while updating record : - " + err.message);
                            return reject(res.status(409).json({
                                "Message": "Error while adding office address in country " + req.body["country"] + " and city " + req.body["city"] + " in user office locations collection"
                            }));
                        } else if (doc === null) {
                            logger.error("Error while updating record : - unable to update office location database");
                            return reject(res.status(409).json({
                                "Message": "Error while adding new office location due to " + err.message
                            }));
                        }
                        resolve();
                    });
            }   
        })
    })
    .then(function () {
        officeLocationSchema.save(function (error, data) {
            if (error) {
                logger.error("Error saving office location schema : - " + error.message)
                return res.status(500).json({ "Message": error.message.trim() });
            }
            else {
                return res.json({ "Message": "Office location got inserted successfully" });
            }
        })
    })
    .catch(function (err) {
        logger.error("Error while inserting record in office location schema: - " + err.message)
        return res.status(500).json({ "Message": err.message });
    })

}
/* check whether city and country is found in database */
function checkCityandCountry(req,next) {

    var cityFound = false;
    var countryfound = false;
     /* check for both country and city */
    officeLocationModel.findOne({
        "country": req.body["country"], "officeCity": { $elemMatch: { "city": req.body["city"] } }
    }, function (err, doc) {
        if (doc == null) {
            /* check for country */
            officeLocationModel.findOne({
                "country": req.body["country"]
            }, function (err, doc) {
                if (doc == null) {
                    next(false + "|" + false)
                } else {
                    next(true + "|" + false)
                }
            })           
        } else {
            next(true + "|" + true)
        }
    })

}