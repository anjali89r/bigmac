var mongoose = require('mongoose');
var Promise = require('promise');
var logger = require('../utilities/logger.js');
require('../../model/costComparisonModel.js');
var treatmentDesc = require('./treatmentDescController.js');
var costComparisonModel = mongoose.model('treatment_cost_comparison');

/* API to add new global treatment charge details */
module.exports.addGlobalTreatmentCost = function (req, res) {

    if (res.headersSent) {//check if header is already returned
        logger.warn("Response already sent.Hence skipping the function call addGlobalTreatmentCost")
        return;
    }

    var costSchema = new costComparisonModel();

    new Promise(function (resolve, reject) {

        treatmentDesc.verifyProcedureExistence(req.body["procedure"], function (flag) {          
            if (flag != 'true') {
                return reject(res.status(200).json({ "Message": "Please add procedure details in treatment_descriptions table first"}));
            } else {
                resolve()
            }
        })

    }).then(function(){
    
        new Promise(function (resolve, reject) {
        
            //check if procedure cost for a country is already stored in table
            costComparisonModel.findOne({
                "procedureName": req.body["procedure"]
            }, { "countryWise": { $elemMatch: { "country": req.body['country'] } } }, {"countryWise": { $elemMatch: { "activeFlag": 'Y' } }
            }, function (err, doc) {               
                if (doc !== null && doc.procedureName != null) {                    
                    logger.warn("Procedure cost for " + req.body['procedure'] + " in country " + req.body["country"] + " already exists in database");
                    return reject(res.status(409).json({ "Message": "Procedure cost for " + req.body['procedure'] + " in country " + req.body["country"] + " already exists in database" }));                    
                } else {//check if procedure is already added to collection
                    costComparisonModel.findOne({
                        "procedureName": req.body["procedure"]
                    }, function (err, doc) {
                        if (doc!=null) {
                            logger.info("procedureName name " + req.body["procedure"] + " already exists in database");
                            resolve(true)
                        } else {
                            resolve(false)
                        }
                    })
                }
            })
        }).then(function (flag) {
       
            //If procedure and country are not in db
            if (flag == false) {
                costSchema.procedureName = req.body["procedure"],               
                costSchema.countryWise = [{
                country: req.body['country'],
                cost: req.body['cost'],
                currency: req.body['currency'],                   
                activeFlag: req.body["activeFlag"]
                }]
                costSchema.save(function (error) {
                    if (error) {
                        logger.error("Error while inserting record in cost comparison details collection: - " + error.message)
                        return res.status(500).json({ "Message": error.message.trim() });
                    }
                    else {
                        return res.status(201).json({ "Message": "Data got inserted successfully in treatment_cost_comparison collection" });
                    }
                })

            } else {//add details for anew country
                costComparisonModel.findOneAndUpdate({
                    "procedureName": req.body["procedure"]
                },
                    {
                        "$push": {
                            "countryWise": {
                               "country": req.body['country'],
                                "cost": req.body['cost'],
                                "currency": req.body['currency'],
                                "activeFlag": req.body["activeFlag"]
                            }
                        }
                    },
                    { new: true }, function (err, doc) {
                        if (err) {
                            logger.error("Error while updating record : - " + err.message);
                            return res.status(409).json({
                                "Message": "Error while updating procedure cost for " + req.body['procedure'] + " in treatment_cost_comparison collection"
                            });
                        } else if (doc === null) {
                            logger.error("Error while updating record : - unable to update treatment_cost_comparison database");
                            return res.status(409).json({
                                "Message": "Error while adding new cost record for " + req.body['procedure'] + err.message
                            });
                        } else {
                            return res.status(201).json({ "Message": "Data got updated successfully in treatment_cost_comparison collection" });
                        }
                    });
            }

        }).catch(function (err) {
            return res.status(500).json({ "Message": err.message });
            });

    }).catch(function (err) {
        return res.status(500).json({ "Message": err.message });
    });
}

  
/*Get global treatment cost*/
module.exports.getGlobalTreatmentCost = getGlobalTreatmentCost;

/*Get global treatment cost function for API call*/
module.exports.getcostComparisonData = function (req, res) {

    if (res.headersSent) {//check if header is already returned
        logger.warn("Response already sent.Hence skipping the function call getcostComparisonData")
        return;
    }  

    var procedure = req.params.procedure

    getGlobalTreatmentCost(procedure, function(cost){

        if (cost == null) {
            return res.status(500).json({ "Message": "Error while retriving cost comparison from database" });
        } else {
            return res.json(cost);
        }
    })
}
/*Get global treatment cost function for local use*/
function getGlobalTreatmentCost(procedure, next) {
   
    var costSchema = new costComparisonModel();

    costComparisonModel.aggregate([
        {
            "$match": {
                "$and": [{ "activeFlag": "Y" }, { "procedureName": procedure }, { "countryWise.activeFlag": "Y" }]
            }
        },
        {
            "$project": {
                "_id": 0, "countryWise.country": 1, "countryWise.cost": 1, "countryWise.currency": 1,
            }
        }

    ], function (err, result) {

        if (err) {
            logger.error("Error while reading treatment description from DB");
             next(null)
        } else if (!result.length) {
            logger.info("getGlobalTreatmentCost - There is no treatment description available for the treatment");
            next(null)
        }
        else {            
            next(result[0]);            
        }
    })
}



