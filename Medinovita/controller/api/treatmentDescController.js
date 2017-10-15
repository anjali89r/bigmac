var mongoose = require('mongoose');
var Promise = require('promise');
var logger = require('../utilities/logger.js');
require('../../model/treatmentsDescModel.js');
var treatmentDescModel = mongoose.model('treatmentOffered_description');


/* API to add new treatment description details */
module.exports.addtreatmentDescription = function (req, res) {

    if (res.headersSent) {//check if header is already returned
        logger.warn("Response already sent.Hence skipping the function call addtreatmentDescription")
        return;
    }

    var treatmentSchema = new treatmentDescModel();

    new Promise(function (resolve, reject) {
        //check if procedure name already exists under a different department
        treatmentDescModel.findOne({
            "treatmentList": { $elemMatch: { "procedureName": req.body["procedureName"] } }
        }, { department: 1, _id: 0 }, function (err, doc) {
            if (doc != null) {                
                if (doc.department != req.body["department"]) {
                    return reject(res.status(409).json({ "Message": "Procedure name " + req.body['procedureName'] + " already exists under department " + doc.department}));                    
                }
           } 
        })

        //check if treatment and procedure details are already stored in table
        treatmentDescModel.findOne({
            "department": req.body["department"], "treatmentList": { $elemMatch: { "procedureName": req.body["procedureName"] } }
        }, function (err, doc) {
            if (doc != null) {
                logger.warn("Procedure name " + req.body['procedureName'] + " already exists in database");
                return reject(res.status(200).json({ "Message": "Procedure name " + req.body['procedureName'] + " already exists in database" }));
            } else {//check if department is already added to collection
                treatmentDescModel.findOne({
                    "department": req.body["department"]
                }, function (err, doc) {
                    if (doc != null) {
                        logger.info("Department name " + req.body["department"] + " already exists in database");
                        resolve("true|false");
                    } else {
                        resolve("false|false");
                    }
                })
            }
        })
    }).then(function (flag) {
        var departmentFound = flag.split(/\|/)[0];
        var treatmentFound = flag.split(/\|/)[1];

        //If department and treatments are not in db
       if (departmentFound == 'false' && treatmentFound == 'false'){
                treatmentSchema.department = req.body["department"],
                treatmentSchema.departmentDescription= req.body["departmentDescription"],
                treatmentSchema.serviceActiveFlag = req.body["serviceActiveFlag"],
                treatmentSchema.departmentImagepath = req.body["departmentImagepath"],            
                treatmentSchema.treatmentList = [{
                    procedureName: req.body['procedureName'] ,
                    displayName: req.body['displayName'],
                    treatmentDescription: req.body['treatmentDescription'], 
                    shortDescription: req.body['shortDescription'],   
                    healingTimeInDays: req.body['healingTime'],
                    minHospitalization : req.body["minHospitalization"],
                    maxHospitalization : req.body["maxHospitalization"],
                    surgicalTime : req.body["surgicalTime"],
                    postFollowupDuration : req.body["postFollowupDuration"],
                    postFollowupFrequency : req.body["postFollowupFrequency"],            
                    procedureImagepath: req.body["procedureImagepath"],
                    activeFlag: req.body["activeFlag"]
                }]
       } else if (departmentFound == 'true' && treatmentFound == 'false') {//update new field
           treatmentDescModel.findOneAndUpdate({
               "department": req.body["department"]
           },
               {
                   "$push": {
                       "treatmentList": {
                           "procedureName": req.body['procedureName'],
                           "displayName": req.body['displayName'],
                           "treatmentDescription": req.body['treatmentDescription'],
                           "shortDescription": req.body['shortDescription'],   
                           "healingTime": req.body['healingTime'],
                           "minHospitalization": req.body["minHospitalization"],
                           "maxHospitalization": req.body["maxHospitalization"],
                           "surgicalTime": req.body["surgicalTime"],
                           "postFollowupDuration": req.body["postFollowupDuration"],
                           "postFollowupFrequency": req.body["postFollowupFrequency"],
                           "procedureImagepath": req.body["procedureImagepath"],
                           "activeFlag": req.body["activeFlag"]
                       }
                   }
               },
               { new: true }, function (err, doc) {
                   if (err) {
                       logger.error("Error while updating record : - " + err.message);
                       return res.status(409).json({
                           "Message": "Error while updating new treatment " + req.body['procedureName'] + " in treatmentOffered_description collection"
                       });
                   } else if (doc === null) {
                       logger.error("Error while updating record : - unable to update treatmentOffered_description database");
                       return res.status(409).json({
                           "Message": "Error while adding new record for "+  req.body['procedureName']   + err.message
                       });
                   }
               });
       }

    }).then(function () {

        treatmentSchema.save(function (error) {
            if (error) {
                logger.error("Error while inserting record in treatment details collection: - " + error.message)
                return res.status(500).json({ "Message": error.message.trim() });
            }
            else {
                return res.json({ "Message": "Data got inserted successfully in treatmentOffered_description collection" });
            }
        })

    })
    .catch(function (err) {
        return res.json({ "Message": err.message });
    });
}
/* API to get treatment details */
module.exports.getTreatmentSection = function (req, res) {

    if (res.headersSent) {//check if header is already returned
        logger.warn("Response already sent.Hence skipping the function call get newsSection")
        return;
    }

    var treatmentDescSchema = new treatmentDescModel();

    treatmentDescModel.aggregate([
        {
            "$match": {
                "$and": [{ "serviceActiveFlag": "Y" }, { "treatmentList.procedureName": req.query.procedure }, { "treatmentList.activeFlag": "Y" }] }},         
        {
            "$project": {
                "_id": 0, "department": 1, "departmentDescription": 1, "departmentImagepath": 1, "treatmentList.procedureName": 1, "treatmentList.displayName": 1, "treatmentList.treatmentDescription": 1, "treatmentList.shortDescription": 1,
                "treatmentList.healingTimeInDays": 1, "treatmentList.minHospitalization": 1, "treatmentList.maxHospitalization": 1, "treatmentList.surgicalTime": 1, "treatmentList.postFollowupDuration": 1, "treatmentList.postFollowupFrequency": 1,
                "treatmentList.procedureImagepath": 1
            }
        }
        
    ], function (err, result) {

        if (err) {
            logger.error("Error while reading treatment description from DB");
            return res.status(500).json({ "Message": err.message.trim() });
        } else if (result == null) {
            logger.info("There is no treatment description available for the treatment");
            return res.status(200).json({ "Message": err.message.trim() });
        }
        else {
            return res.json(result);
        }
    })
}