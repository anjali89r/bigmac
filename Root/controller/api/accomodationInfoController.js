var mongoose = require('mongoose');
var Promise = require('promise');
var logger = require('../utilities/logger.js');
require('../../model/accomodationInfoModel.js');
var hotelModel = mongoose.model('hotel_details');
var counterSchema = require('../../model/identityCounterModel.js');

var collection = 'hotel_details';

/* API to add new accomodation vendor details */
module.exports.addAccomodationVendorDtls = function (req, res) {

    if (res.headersSent) {//check if header is already returned
        logger.warn("Response already sent.Hence skipping the function call addAccomodationVendorDtls")
        return;
    }

    var hotelSchema = new hotelModel();

    new Promise(function (resolve, reject) {

        hotelModel.findOne({
            "name": req.body['hotelName'], "contact.postalCode": parseInt(req.body['postalCode'])
        }, function (err, doc) {
            if (doc != null) {
                logger.warn("Hotel details with name " + req.body['providerName'] + " already exists in database");
                return reject(res.status(409).json({ "Message": "Hotel details with name " + req.body['hotelName'] + " already exists in database" }));
            } else {
                counterSchema.getNext('hotelID', collection, function (id) {
                    hotelID = id;
                    resolve(hotelID);
                })
            }
        })
    }).then(function (hotelID) {

            hotelSchema.hotelID = hotelID,
            hotelSchema.name = req.body['hotelName'],
            hotelSchema.hotelRating = req.body['hotelRating']

            hotelSchema.contact.addressLine1 = req.body['addressLine1'],
            hotelSchema.contact.addressLine2 = req.body['addressLine2'],
            hotelSchema.contact.city = req.body['city'],
            hotelSchema.contact.postalCode = parseInt(req.body['postalCode']),
            hotelSchema.contact.residingcountry = req.body['country'],
            hotelSchema.contact.landmark = req.body['landmark'],
            hotelSchema.contact.contactPerson = req.body['contactPerson'],
            hotelSchema.contact.contactEmailId = req.body['contactEmailId'],
            hotelSchema.contact.primaryContactNumber = parseInt(req.body['primaryContactNumber'])
            if (req.body['secondaryContactNumber'].toString().trim().length == 10) {
                hotelSchema.contact.secondaryContactNumber = parseInt(req.body['secondaryContactNumber'])
            }
            hotelSchema.serviceActiveFlag = req.body['serviceActiveFlag'],

            hotelSchema.cost.currency = parseInt(req.body['currency']),
            hotelSchema.cost.singleBedRoomCost = parseInt( req.body['singleBedRoomCost']),
            hotelSchema.cost.doubleBedRoomCost = parseInt(req.body['doubleBedRoomCost']),
            hotelSchema.cost.suiteRoomCost = parseInt( req.body['suiteRoomCost']),
            hotelSchema.cost.extraGuestCost = parseInt(req.body['extraGuestCost']),
            hotelSchema.cost.buffetLunchCost = parseInt(req.body['buffetLunchCost']),
            hotelSchema.cost.buffetDinnerCost = parseInt(req.body['buffetDinnerCost']),
            hotelSchema.cost.currency = req.body['currency'],

            hotelSchema.freebee.complimentaryBreakfast = req.body['complimentaryBreakfast'],
            hotelSchema.freebee.freeAirportPickup = req.body['freeAirportPickup'],
            hotelSchema.freebee.freeLocalTransfer = req.body['freeLocalTransfer'],

            hotelSchema.checkInTime = req.body['checkInTime'],
            hotelSchema.checkOutTime = req.body['checkOutTime'],
            hotelSchema.amnities = req.body['amnities']
               
    }).then(function () {

        hotelSchema.save(function (error) {
            if (error) {
                logger.error("Error while inserting record in hotel_details collection: - " + error.message)
                return res.status(500).json({ "Message": error.message.trim() });
            }
            else {
                return res.status(201).json({ "Message": "Data got inserted successfully in hotel_details collection" });
            }
        })

    })
    .catch(function (err) {
        return res.status(500).json({ "Message": err.message });
    });
}

/* API to update an existing accomodation vendor details */
module.exports.updateAccomodationVendorDtls = function (req, res) {

    if (res.headersSent) {//check if header is already returned
        logger.warn("Response already sent.Hence skipping the function call updateAccomodationVendorDtls")
        return;
    }

    var hotelSchema = new hotelModel();

    hotelModel.findOneAndUpdate({ "name": req.body['hotelName'], "contact.postalCode": parseInt(req.body['postalCode']) },
        {
            $set: {
                "hotelRating" : req.body['hotelRating'],
                "contact.addressLine1" : req.body['addressLine1'],
                "contact.addressLine2" : req.body['addressLine2'],
                "contact.city" : req.body['city'],
                "contact.postalCode" : parseInt(req.body['postalCode']),
                "contact.residingcountry" : req.body['country'],
                "contact.landmark" : req.body['landmark'],
                "contact.contactPerson" : req.body['contactPerson'],
                "contact.contactEmailId" : req.body['contactEmailId'],
                "contact.primaryContactNumber" : parseInt(req.body['primaryContactNumber']),
               // if (req.body['secondaryContactNumber'].toString().trim().length == 10) {
                        "contact.secondaryContactNumber" : parseInt(req.body['secondaryContactNumber']),
                   // }
                "serviceActiveFlag" : req.body['serviceActiveFlag'],
                "cost.singleBedRoomCost" : parseInt(req.body['singleBedRoomCost']),
                "cost.doubleBedRoomCost" : parseInt(req.body['doubleBedRoomCost']),
                "cost.suiteRoomCost" : parseInt(req.body['suiteRoomCost']),
                "cost.extraGuestCost" : parseInt(req.body['extraGuestCost']),
                "cost.buffetLunchCost" : parseInt(req.body['buffetLunchCost']),
                "cost.buffetDinnerCost" : parseInt(req.body['buffetDinnerCost']),
                "cost.currency" : req.body['currency'],

                "freebee.complimentaryBreakfast" : req.body['complimentaryBreakfast'],
                "freebee.freeAirportPickup" : req.body['freeAirportPickup'],
                "freebee.freeLocalTransfer" : req.body['freeLocalTransfer'],

                "checkInTime" : req.body['checkInTime'],
                "checkOutTime" : req.body['checkOutTime'],
                "amnities" : req.body['amnities']
            }
        }, { new: true },
        function (err, doc) {
            if (err) {
                logger.error("Error while updating record : - " + err.message);
                return res.status(409).json({
                    "Message": "Error while updating hotels details of provider " + req.body['hotelName'] + " in accomodation details table"
                });
            } else if (doc === null) {
                logger.error("Error while updating record in accomodation details : - unable to update database");
                return res.status(409).json({
                    "Message": "Error while updating hotels details of provider " + req.body['hotelName'] + " due to " + err.message
                });
            } else {
                //save document
                doc.save()
                return res.status(202).json({ "Message": "Data got updated successfully in hotel_details collection" });                
            }

        });
}

/* API to get list of active accomodation vendor details */
module.exports.getActiveHotelDtls = function (req, res) {

    if (res.headersSent) {//check if header is already returned
        logger.warn("Response already sent.Hence skipping the function call getActiveHotelDtls")
        return;
    }

    hotelModel.aggregate([{ "$match": { "serviceActiveFlag": "Y" } },
    {
        "$project": {
            "_id": 0,
            "hotelRating": 1,
            "contact.addressLine1": 1,
            "contact.city":1,
            "contact.postalCode": 1,
            "contact.residingcountry":1,
            "contact.landmark": 1,
            "contact.contactPerson": 1,
            "contact.contactEmailId": 1,
            "contact.primaryContactNumber": 1,            
            "contact.secondaryContactNumber": 1,
            "cost.singleBedRoomCost": 1,
            "cost.doubleBedRoomCost": 1,
            "cost.suiteRoomCost": 1,
            "cost.extraGuestCost": 1,
            "cost.buffetLunchCost": 1,
            "cost.buffetDinnerCost": 1,
            "cost.currency" : 1,

            "freebee.complimentaryBreakfast": 1,
            "freebee.freeAirportPickup": 1,
            "freebee.freeLocalTransfer": 1,

            "checkInTime": 1,
            "checkOutTime": 1,
            "amnities": 1
        }
    }
    ], function (err, result) {

        if (err) {
            logger.error("Error while reading hotel packages from from DB");
            return res.status(500).json({ "Message": err.message.trim() });
        } else if (!result.length) {
            logger.info("There are no active hotel details present in database");
            return res.status(200).json({"Message": "There are no active hotel details present in database" });
        }
        else {
            return res.status(200).json(result);
        }
    })
}