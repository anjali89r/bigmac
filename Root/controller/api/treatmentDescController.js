var mongoose = require('mongoose');
var Promise = require('promise');
var logger = require('../utilities/logger.js');
var gridFS = require('./gridFSController.js');
var cost = require('./costController.js');
var _ = require('underscore');
require('../../model/treatmentsDescModel.js');
var treatmentSearch = require('./hospitaltreatmentSearchController.js');
var counterSchema = require('../../model/identityCounterModel.js');
var treatmentDescModel = mongoose.model('treatmentOffered_description');

var collection = 'hospital_doctor_details'; //hospital and doctor is used here for incrementing ids.

/* API to add new treatment description details */
module.exports.addtreatmentDescription = function (req, res) {

    if (res.headersSent) {//check if header is already returned
        logger.warn("Response already sent.Hence skipping the function call addtreatmentDescription")
        return;
    }

    var saveFlag=false

    var treatmentSchema = new treatmentDescModel();
//console.log(req.body['displayName'])
    new Promise(function (resolve, reject) {
        //check if procedure name already exists under a different department
        treatmentDescModel.findOne({
            "treatmentList": { $elemMatch: { "displayName": req.body["procedureName"] } }
        }, { department: 1, _id: 0 }, function (err, doc) {
            if (doc != null) {                
                if (doc.department != req.body["department"]) {
                    return reject(res.status(409).json({ "Message": "Procedure name " + req.body['procedureName'] + " already exists under department " + doc.department}));                    
                }
           } 
        })

        //check if treatment and procedure details are already stored in table
        treatmentDescModel.findOne({
            "department": req.body["department"]
        }, {"treatmentList": { $elemMatch: { "displayName": req.body["procedureName"] } }
        }, function (err, doc) {
            if (doc !=null && doc.department != null) {
                logger.warn("Procedure name " + req.body['procedureName'] + " already exists in database");
                return reject(res.status(200).json({ "Message": "Procedure name " + req.body['procedureName'] + " already exists in database" }));
            } else {//check if department is already added to collection
                treatmentDescModel.findOne({
                    "department": req.body["department"]
                }, function (err, doc) {
                    if (doc != null) {
                        logger.info("Department name " + req.body["department"] + " already exists in database");   
                        var appIds = 0
                        getId("false", "true", function (id) {
                            appIds = id;
                            console.log(appIds)
                            resolve("true|false|" + appIds);
                        })                               
                    } else {
                        var appIds=0
                        getId("true", "true", function (id){
                            appIds = id;  
                            resolve("false|false|" + appIds);
                        })                        
                        
                    }
                })
            }
        })
    }).then(function (flag) {

        var departmentFound = flag.split(/\|/)[0];
        var treatmentFound = flag.split(/\|/)[1];
        var departmentId = parseInt(flag.split(/\|/)[2])
        var procedureId = parseInt(flag.split(/\|/)[3])
        //If department and treatments are not in db
  //      console.log(departmentFound)
        if (departmentFound == 'false' && treatmentFound == 'false') {
            treatmentSchema.department = req.body["department"],
                treatmentSchema.departmentId = departmentId,
                treatmentSchema.departmentDescription = req.body["departmentDescription"],
                treatmentSchema.serviceActiveFlag = req.body["serviceActiveFlag"],
                treatmentSchema.departmentImagepath = req.body["departmentImagepath"],
               // console.log("hello1",req.body['displayName'].replace(/\s+/g, '-').toLowerCase());
                treatmentSchema.treatmentList = [{
                    //procedureName: req.body['procedureName'],
                    
                    procedureName: req.body['displayName'].replace(/\s+/g, '-').toLowerCase(),
                    procedureId: procedureId,
                    displayName: req.body['displayName'],
                    treatmentDescription: req.body['treatmentDescription'],
                    shortDescription: req.body['shortDescription'],
                    healingTimeInDays: req.body['healingTime'],
                    minHospitalization: req.body["minHospitalization"],
                    maxHospitalization: req.body["maxHospitalization"],
                    surgicalTime: req.body["surgicalTime"],
                    postFollowupDuration: req.body["postFollowupDuration"],
                    postFollowupFrequency: req.body["postFollowupFrequency"],
                    procedureImagepath: req.body["procedureImagepath"],
                    activeFlag: req.body["activeFlag"]
                }]
                //console.log("hello2");
                treatmentSchema.save(function (error) {
                    if (error) {
                        logger.error("Error while inserting record in treatment details collection: - " + error.message)
                       // console.log("hello4");
                        return res.status(500).json({ "Message": error.message.trim() });
                    }
                    else {
                        return res.json({ "Message": "Data got inserted successfully in treatmentOffered_description collection" });
                    }
                })
            
        } else if (departmentFound == 'true' && treatmentFound == 'false') {//update new field
    //        console.log("hello3");
            treatmentDescModel.findOneAndUpdate({
                "department": req.body["department"]
            },
                {
                    "$push": {
                        "treatmentList": {
                            //"procedureName": req.body['procedureName'],
                            "procedureName": req.body['displayName'].replace(/\s+/g, '-').toLowerCase(),
                            "procedureId": procedureId,
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
                            "Message": "Error while updating new treatment " + req.body['displayName'] + " in treatmentOffered_description collection"
                        });
                    } else if (doc === null) {
                        logger.error("Error while updating record : - unable to update treatmentOffered_description database");
                        return res.status(409).json({
                            "Message": "Error while adding new record for " + req.body['displayName'] + err.message
                        });
                    } else {
                        return res.json({ "Message": "Data got updated successfully in treatmentOffered_description collection" });
                    }                    
                });
            }

    }).catch(function (err) {
        return res.json({ "Message": err.message });
    });
}
/* API to get treatment details */
module.exports.getTreatmentSectionold = function (req, res) {

    if (res.headersSent) {//check if header is already returned
        logger.warn("Response already sent.Hence skipping the function call get newsSection")
        return;
    }

    var treatmentDescSchema = new treatmentDescModel();

    treatmentDescModel.aggregate([
        {
            "$match": {
                "$and": [{ "serviceActiveFlag": "Y" }, { "department": req.params.department }, { "treatmentList.activeFlag": "Y" }] }},         
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

/* Get department and procedure id from counter schema */
function getId(departmentIDFlag, procedureIdFlag, callback) {

    new Promise(function (resolve, reject) {
        if (departmentIDFlag == 'true') {
            counterSchema.getNext('Treatment.$.departmentId', collection, function (id) {
                departmentID = id;
                resolve(departmentID);
            });
        } else {
            resolve(0);
        }
    }).then(function (departmentID) {

        new Promise(function (resolve, reject) {
            if (procedureIdFlag == 'true') {
                counterSchema.getNext('Treatment.$.procedureid', collection, function (id) {
                    procedureId = id;
                    resolve(procedureId);
                    return callback(departmentID + "|" + procedureId)
                });
            } else {
                resolve(0);
                return callback("0" + "|" + "0")
            }
        })
     }) 
}

/* **************Get Procedure id,department id from treatments schema ***************** */
module.exports.isTreatmentExists = function (procedureName, callback) {
    
    var dict = [];

    treatmentDescModel.findOne({ "treatmentList": { $elemMatch: { "displayName": procedureName } } }, {
        "departmentId": 1, "treatmentList.procedureId": 1,"_id": 0
    }, function (err, doc) {//{ $set: { <field1>: <value1>, ... } }
        if (err) {
            logger.error("Error while reading procedure id,department id from treatments description schema : - " + err.message);
            callback(dict);
        } else if (doc!= null) {
            logger.info("Procedure " + procedureName + " already exists in treatments offered collection");
            dict["procedureId"] = doc.treatmentList[0].procedureId; 
            dict["procedureparentDepartmentid"] = doc.departmentId;
            callback(dict);
        } else {
            callback(dict);
        }
    });
}

/* **************Verify if aparticular procedure is already present ***************** */
module.exports.verifyProcedureExistence = function (procedureName, callback) {

    treatmentDescModel.findOne({ "treatmentList": { $elemMatch: { "displayName": procedureName } } }, { 'treatmentList.$': 1 },
        function (err, doc) {//{ $set: { <field1>: <value1>, ... } }
        if (err) {            
            callback("false");
        } else if (doc != null) {  
            callback("true");
        } else {           
            callback("false");
        }
    });
}

/* API to get treatment details without the avarage cost for each treatment */
module.exports.getTreatmentSectionWithoutCost = function (req, res) {

    if (res.headersSent) {//check if header is already returned
        logger.warn("Response already sent.Hence skipping the function call get newsSection")
        return;
    }

    var department = req.query.department;

    var treatmentDescSchema = new treatmentDescModel();

    treatmentDescModel.aggregate([
        {
            "$match": {
                "$and": [{ "serviceActiveFlag": "Y" }, { "department": department }, { "treatmentList.activeFlag": "Y" }]
            }
        },
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
            return res.status(409).json({ "Message": "Department " + department + " does not exists in tretment_description collection" });
        } else if (!result.length) {
            logger.error("There is no treatment description available for the treatment");
            return res.status(409).json({ "Message": "Department " + department + " does not exists in tretment_description collection" });
        }
        else {
            return res.json(result);
        }
    })
}

/* API to get treatment details with avarage cost for each treatment */
module.exports.getTreatmentSectionWithCost = function (req, res) {

    if (res.headersSent) {//check if header is already returned
        logger.warn("Response already sent.Hence skipping the function call get newsSection")
        return;
    }

    var department = req.query.department;
    var reqbody = req.body
    //console.log(reqbody)
    getTreatmentDetailsDepartmentwiseWithCost(department, reqbody, function (result) {
        return res.json(result);
    })
}
/* function to get treatment details with avarage cost for each treatment */
module.exports.getTreatmentDetailsDepartmentwiseWithCost = getTreatmentDetailsDepartmentwiseWithCost;
function getTreatmentDetailsDepartmentwiseWithCost(department, reqbody, next) {

    var treatmentDescSchema = new treatmentDescModel();

    new Promise(function (resolve, reject) {

        treatmentDescModel.aggregate([
            {
                "$match": {
                    "$and": [{ "serviceActiveFlag": "Y" }, { "department": department }, { "treatmentList.activeFlag": "Y" }]
                }
            }, {
                "$project": {
                    "_id": 0, "department": 1, "departmentDescription": 1, "departmentImagepath": 1, "treatmentList.procedureName": 1, "treatmentList.displayName": 1, "treatmentList.treatmentDescription": 1, "treatmentList.shortDescription": 1,
                    "treatmentList.healingTimeInDays": 1, "treatmentList.minHospitalization": 1, "treatmentList.maxHospitalization": 1, "treatmentList.surgicalTime": 1, "treatmentList.postFollowupDuration": 1, "treatmentList.postFollowupFrequency": 1,
                    "treatmentList.procedureImagepath": 1, "tretmentCostColl": 1
                }
            }

        ], function (err, result) {
            if (err) {
                logger.error("Error while reading treatment description from DB");
                next("Error while reading treatment description from DB");
            } else if (result == null) {
                logger.error("There is no treatment description available for the treatment");
                next("There is no treatment description available for the treatment");
            } else if (!result.length) {
                logger.error("There is no treatment description available for the treatment");
                next("There is no treatment description available for the treatment");
            } else {
                resolve(result)
            }
        })

    }).then(function (result) {

        var promises = [];
        //loop through department
        for (var i = 0; i < result.length; i++) {
            var obj = result[i];
            var department = obj.department
            var procedureList = obj.treatmentList
            //loop through procedures in department
            for (var j = 0; j < procedureList.length; j++) {
                var procedure = procedureList[j];
                var procedureDisp = procedure.displayName
                var treatmentDescription = procedure.shortDescription               
                /*promises.push(cost.getAvarageCostAsInt(procedureDisp).then(function (data) {
                    console.log(procedureName + ": " + JSON.stringify(data))
                    //console.log(procedureDisp + ": " + data[0].avarageTreatmentCost)
                }))*/
                promises.push(cost.getAvarageCostAsInt(procedureDisp))
                promises.push(treatmentSearch.getHospitalListByProcedure(procedureDisp))
                promises.push(treatmentSearch.getProcedureDescriptionFromFile(treatmentDescription))
            }
        }

        Promise.all(promises).then(function (doc) {
            //loop through department
            var hosdict = {};
            var citydict = {};
            var costdict = {};
            var proceduredict = {};
            var costArray=[]

            for (var i = 0; i < result.length; i++) {
                var obj = result[i];
                obj['distHospitalList'] = []
                obj['distCityList'] = []
                obj['distCostList'] = []
                obj['distProcedure'] = []
                var costCounter = 0
                var hospitalCounter = 1
                var descCounter = 2
                var procedureList = obj.treatmentList
                //loop through procedures in department
                for (var j = 0; j < procedureList.length; j++) {
                    var procedure = procedureList[j];
                    var procedureDisp = procedure.displayName
                    //to get unique procedure names
                    if (!(procedureDisp in proceduredict)) {
                        proceduredict[procedureDisp] = ''
                        obj['distProcedure'].push({ 'procedureName': procedureDisp })
                    }

                    var json = doc[costCounter]
                    var hosJson = doc[hospitalCounter]
                    var descJson = doc[descCounter]
                    //add new key
                    procedure["procedureAvarageCost"] = json[0].avarageTreatmentCost + "$"
                    procedure["procedureNameAttr"] = procedureDisp.split(' ').join('_')
                    procedure["hospitalList"] = hosJson[0].hospitalList
                    procedure["treatmentActualDescription"] = descJson[0].procedureActualDescription
                    //get unique hospital data to apply filter in treatements offered
                    var hospJson = procedure["hospitalList"]
                    for (var k = 0; k < hospJson.length; k++) {
                        var data = hospJson[k];                        
                        var hospitalName = data.hospitalName
                        var city = data.city + "," + data.country
                        var cost = data.costStartsFrom
                        if (!(hospitalName in hosdict)) {
                            hosdict[hospitalName] = ''
                            obj['distHospitalList'].push({ 'hospitalName': hospitalName })
                        }
                        if (!(city in citydict)) {
                            citydict[city] = ''
                            obj['distCityList'].push({ 'city': city })
                        }
                        if (!(cost in costdict)) {
                            costdict[cost] = ''
                            costArray.push(cost)                           
                        }
                    }

                    //increment counter
                    costCounter = costCounter + 3
                    hospitalCounter = hospitalCounter + 3
                    descCounter = descCounter + 3
                }
            }
            //sort cost
            costArray.sort();
            for (var x = 0; x < costArray.length; x++) {
                obj['distCostList'].push({ 'costStartsFrom': costArray[x] })
            }

            //code to filter reuslt during form submission
            var output
            if (Object.keys(reqbody).length != 0) {//not for the first time when page loads           
                var myString = JSON.stringify(result);
                var myObject = JSON.parse(myString);                                
                
                var treatmentArray = [] 
                var hospitalArray = []
                var cityArray = []

                //Store procedure from form in array
                if (typeof reqbody.procedure != 'undefined') {       
                    if (reqbody.procedure instanceof Array) {             
                        var treatmentArray = reqbody.procedure
                    } else {                          
                        treatmentArray.push(reqbody.procedure)
                    }
                    output = myObject.map(function (obj) {
                        obj.treatmentList = obj.treatmentList.filter(function (item) {                           
                            return treatmentArray.indexOf(item.procedureName) > -1
                                /*&&
                                item.hospitalList.some(function (hospital) {
                                    return hospital.hospitalName == 'Renai Medicity';
                                });*/
                        });
                        return obj;
                    });
                }
                //Store hospital from form in array                
                if (typeof reqbody.hospitalname != 'undefined') {                  
                    if (reqbody.hospitalname instanceof Array) {
                        var hospitalArray = reqbody.hospitalname
                    } else {
                        hospitalArray.push(reqbody.hospitalname)
                    }
                    output = myObject.map(function (obj) {
                        obj.treatmentList = obj.treatmentList.filter(function (item) {
                            return item.hospitalList.some(function (hospital) {
                                return hospitalArray.indexOf(hospital.hospitalName) > -1
                            });                            
                        });
                        return obj;
                    });
                }
                //Store city from form in array               
                if (typeof reqbody.city != 'undefined') {                    
                    if (reqbody.city instanceof Array) {
                        var cityArray = reqbody.city
                    } else {
                        cityArray.push(reqbody.city)
                    }
                    output = myObject.map(function (obj) {
                        obj.treatmentList = obj.treatmentList.filter(function (item) {
                            return item.hospitalList.some(function (hospital) {
                                return cityArray.indexOf(hospital.city + "," + hospital.country ) > -1
                            });
                        });
                        return obj;
                    });
                }
                /*
                var x = myObject.map(function (obj) {
                    obj.treatmentList = obj.treatmentList.filter(function (item) {
                        //return item.procedureName == 'Bone Grafting' &&
                        return treatmentArray.indexOf(item.procedureName) > -1 &&
                            item.hospitalList.some(function (hospital) {
                                return hospital.hospitalName == 'Renai Medicity';
                            });
                    });
                    return obj;
                }); */
               // console.log('came here')
                result = output                
         }         
         
        }).then(function () {                 
            next(result)
        }).catch((e) => {
            next(e.message);
        });

    }).catch(function (err) {
        next(err.message);
    })
}

/* Function to get procedure details */
module.exports.getProcedureDetails = function getProcedureDetails(procedureName, callback) {

    var treatmentDescSchema = new treatmentDescModel();
//   console.log("I'm here",procedureName)
    treatmentDescModel.aggregate([
        {
            "$match": {
                "$and": [{ "serviceActiveFlag": "Y" }, { "treatmentList.displayName": procedureName }, { "treatmentList.activeFlag": "Y" }]
            }
        },
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
            callback(null);
        } else if (result == null) {
            logger.info("There is no treatment description available for the treatment");
            callback(null);
        }
        else {
            callback(result);
        }
    })
}

/* Function to get distinct procedure names */
module.exports.getUniqueProcedureNames = function (req, res) {

    getUniqueProcedureNames(function (result) {
        return res.json(result);
    })
}
function getUniqueProcedureNames(callback) {

    treatmentDescModel.aggregate([

        { $unwind: "$treatmentList" },
        { $group: { _id: null, treatmentNames: { $addToSet: "$treatmentList" } } }, //_id:null will return everything from array       
        {
            "$project": {
                "_id": 0, "treatmentNames.displayName": 1 //"treatmentNames":1 will return everything from the table
            }
        }


    ], function (err, result) {

        if (err) {
            logger.error("Error while reading treatment description from DB");
            callback(null);
        } else if (result == null) {
            logger.info("There is no treatment description available for the treatment");
            callback(null);
        }
        else {
            callback(result);
        }
    })
}


/* Function to get distinct department names */
module.exports.getUniqueDepartments = function (req, res) {

    getUniqueDepartments(function (result) {
        return res.json(result);
    })
}
function getUniqueDepartments(callback) {

    treatmentDescModel.aggregate([
        {
            "$match": { "$and": [{ "serviceActiveFlag": "Y" }] }
        },    
        {
            "$project": {
                "_id": 0, "department": 1 //"treatmentNames":1 will return everything from the table
            }
        }


    ], function (err, result) {

        if (err) {
            logger.error("Error while reading departments from DB");
            callback(null);
        } else if (result == null) {
            logger.info("There is no unique departments available in DB");
            callback(null);
        }
        else {
            callback(result);
        }
    })
}



/* Function to get distinct procedure names sorted by department */
module.exports.getDepartmentwiseProcedureNames = function (req, res) {

    getDepartmentwiseProcedureNames(function (result) {
        return res.json(result);
    })
}
function getDepartmentwiseProcedureNames(callback) {

    treatmentDescModel.aggregate([
        {
            "$match": { "$and": [{ "serviceActiveFlag": "Y" }] }
        },

        { $unwind: "$treatmentList" },
        {
            $group: {
                _id: "$department", "treatmentNames": {
                    $push: { "procedureName": "$treatmentList.procedureName", "image": "$treatmentList.procedureImagepath", "hospitalStay": "$treatmentList.maxHospitalization" }
                }
            }
        },

        {
            "$project": {
                "_id": 0, "department": '$_id', "treatmentNames": 1
            }
        }

    ], function (err, result) {

        if (err) {
            logger.error("Error while reading treatment description from DB");
            callback(null);
        } else if (result == null) {
            logger.info("There is no treatment description available for the treatment");
            callback(null);
        }
        else {
            callback(result);
        }
    })
}

function getUniqueDataFromCostAPIResult(hospitalJson,uniquearray,callback) {



}