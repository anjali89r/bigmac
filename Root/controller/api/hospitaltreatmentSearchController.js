var mongoose = require('mongoose');
var Promise = require('promise');
var fs = require('fs');
var logger = require('../utilities/logger.js');
var gridFS = require('./gridFSController.js');
require('../../model/hospitalDoctorDetailsModel.js');
var config = require('../utilities/confutils.js');
var hospitalModel = mongoose.model('hospital_doctor_details');
var counterSchema = require('../../model/identityCounterModel.js');

var collection = 'hospital_doctor_details';


/****************************/
module.exports.getTreatmentlist = function (req, res) {

    if (res.headersSent) {//check if header is already returned
        logger.warn("Response already sent.Hence skipping the function call getTreatmentlist")
        return;
    }  

    try{
    if (req.params.treatmentName.toUpperCase() == "ALL") {
        hospitalModel.find().distinct('Treatment.name', function (err, result) {
            if (err) {
                logger.error("Error retrieving the records from DB : - " + err.message)
                return res.status(500).json({ "Message": err.message });
            }
            return res.status(200).json(result.sort());

        });
    }
    else {
         hospitalModel.find().distinct('Treatment.name', function (err, result) {
            if (err)
            {
                logger.error("Error retrieving the records from DB : - " + err.message)
                return res.status(500).json({ "Message": err.message });

            }
            var treatmentArray = []; 
            for (var intvalue = 0; intvalue < result.length; intvalue++)
            {
                if (result[intvalue].toUpperCase().includes(req.params.treatmentName.toUpperCase()))
                    {
                     treatmentArray.push(result[intvalue])

                    }
                                
            }
            
        return res.status(200).json(treatmentArray);
        });
        
    }
    }
    catch (err) {

        return res.status(500).json(err.message);
    
    }
}
module.exports.gethospitalDetailbytreatment = function (req, res) {

    if (res.headersSent) {//check if header is already returned
        logger.warn("Response already sent.Hence skipping the function call gethospitalDetailbytreatment")
        return;
    }  

    try {
        var cityname = req.query.city;
        var treatmentName = req.params.treatmentName;
       // var country = req.params.country;
        var hospitalResult = [];

       // if (country == "")
        //{
         //   country = "India";
        //}
        if (treatmentName == "")
        {
            return res.status(400).json("Please search with treatment name to get hostpital details");
        }
        // added to reterive all hospital details
        if (treatmentName.toUpperCase() == "ALL") {
            hospitalModel.find({}, { _id: 0, hospitalName: 1,hospitalimage:1, hospitalContact: 1, Accreditation: 1, hospitalRating: 1, Treatment: 1 }, function (err, result) {
                if (err) {
                    logger.error("Error retrieving the records from DB : - " + err.message)
                    return res.status(500).json({ "Message": err.message });
                }
                return res.status(200).json(result.sort());
    
            });
        }
        // added to get hospital details when city is not passed
        else if(cityname == undefined || cityname == null){
            hospitalModel.find({ 'Treatment.name': treatmentName}, { _id: 0, hospitalName: 1,hospitalimage:1, hospitalContact: 1, Accreditation: 1, hospitalRating: 1, Treatment: 1 }, function (err, result) {
                if (err) {
                    logger.error("Error retrieving hospital details from DB : - " + err.message)
                    return res.status(500).json({ "Message": err.message });
                }

               // console.log(result.length);
                for (var intArr = 0; intArr < result.length; intArr++)
                {
                    var tempArray = [];
                    for (var inthospArr = 0; inthospArr < result[intArr].Treatment.length; inthospArr++)
                    {
                        if (result[intArr].Treatment[inthospArr].name !== treatmentName)
                        {
                            result[intArr].Treatment.splice(inthospArr, 1);
                            inthospArr = 0;
                            //tempArray.push(result[intArr].Treatment[inthospArr]);
                        }
                        //console.log(result[intArr].Treatment.filter(function (itm) { return itm.name == treatmentName }));
                    }
                    
                }
                
                return res.status(200).json(result.sort());

            });
        }
        // added to filter based on city 
        else{
        //'_id:0 hospitalName hospitalContact Accreditation hospitalRating Treatment'
            hospitalModel.find({ 'Treatment.name': treatmentName,'hospitalContact.City':cityname}, { _id: 0, hospitalName: 1,hospitalimage:1, hospitalContact: 1, Accreditation: 1, hospitalRating: 1, Treatment: 1 }, function (err, result) {
                if (err) {
                    logger.error("Error retrieving hospital details from DB : - " + err.message)
                    return res.status(500).json({ "Message": err.message });
                }

               // console.log(result.length);
                for (var intArr = 0; intArr < result.length; intArr++)
                {
                    var tempArray = [];
                    for (var inthospArr = 0; inthospArr < result[intArr].Treatment.length; inthospArr++)
                    {
                        if (result[intArr].Treatment[inthospArr].name !== treatmentName)
                        {
                            result[intArr].Treatment.splice(inthospArr, 1);
                            inthospArr = 0;
                            //tempArray.push(result[intArr].Treatment[inthospArr]);
                        }
                        //console.log(result[intArr].Treatment.filter(function (itm) { return itm.name == treatmentName }));
                    }
                    
                }
                
                return res.status(200).json(result.sort());

            });
        }

    }
    catch (err)
    {
        return res.status(500).json("Error in fetching the data.Please try again");
    }

}

/*To get various procedures offered by hospitals grouped by department */
module.exports.getDepartmentAndProcedureList_API = function (req, res) {
    var hospitalName = req.params.hospital
    getDepartmentAndProcedureList(hospitalName, function (value) {       
        return res.json({ value })
    })
}
module.exports.getDepartmentAndProcedureList = getDepartmentAndProcedureList
function getDepartmentAndProcedureList(hospitalName, next) {

    hospitalModel.aggregate(
    [
        {
            "$match": { "$and": [{ "serviceActiveFlag": "Y" }, { "hospitalName": hospitalName }] }
        },
        //decompile array
        { $unwind: "$Treatment" },
        {
            $group: {
                _id: "$Treatment.departmentName", "procedureList": {
                    $push: { "procedureName": "$Treatment.name", "cost": "$Treatment.costLowerBound","procedureDispName": "$Treatment.treatmentdisplayname" }
                }
            }
        },
        {
            $project: {
                "_id": 0,
                "department": '$_id',
                "procedureList" :1 ,                      
            }
        }

    ], function (err, result) {

        if (err) {
            logger.error("Error while fetching department and procedure details in table");
            next(null)
        } else if (!result.length) {
            logger.error("There is no hospital records available for " + hospitalName);
            next(null)
        } else {             
            next(result)
        }
    })
}

/* Get list of doctors from a particular hospitals based on user rank */
module.exports.getTopDoctorsinHospital = getTopDoctorsinHospital
function getTopDoctorsinHospital(hospitalName, next) {

    hospitalModel.aggregate([       
        {
            "$match": { "$and": [{ "serviceActiveFlag": "Y" }, { "hospitalName": hospitalName }, { "Treatment.doctor.activeFlag": { $in: ["Y"] } }] }
        },
        //decompile array
        { $unwind: "$Treatment" },
        { $unwind: "$Treatment.doctor" },
        { $unwind: "$Treatment.doctor.speciality" },

        {
            $sort: {
                'Treatment.doctor.medinovitadoctorRating': -1 //descending order
            }
        },
        {
            $project: {
                "_id": 0,
                "docname": "$Treatment.doctor.doctorName",
                "doctorShortName" : "$Treatment.doctor.doctorShortName",
                "docdescription": "$Treatment.doctor.doctorDescription",
                "docspeciality": "$Treatment.doctor.speciality.specialityName",
                "docpicdir": "$Treatment.doctor.profilepicdir",
                "docregistrationnumber":"$Treatment.doctor.registrationNumber",
                "docregistrationauthority": "$Treatment.doctor.registrationAuthority",                
            }
        }

    ], function (err, result) {

        if (err) {
            logger.error("Error while fetching department and procedure details in table");
            next(null)
        } else if (!result.length) {
            logger.error("There is no hospital records available for " + hospitalName);
            next(null)
        } else {
            var temp=[];
            arr=result.filter((x, i)=> {
              if (temp.indexOf(x.image) < 0) {
                temp.push(x.image);
                return true;
              }
              return false;
            })           
            //console.log("Result "+JSON.stringify(arr));        
            next(result)
        }
    })
}

module.exports.getcitylist = function (req, res) {
    
        if (res.headersSent) {//check if header is already returned
            logger.warn("Response already sent.Hence skipping the function call getTreatmentlist")
            return;
        }  
    
        try
        {
        
            hospitalModel.find().distinct('hospitalContact.City', function (err, result) {
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
/* Get list of hospitals offering a particular treatment */
module.exports.getHospitalListByProcedure = function (procedureName) {
    return getHospitalListForaTreatment(procedureName)
}
function getHospitalListForaTreatment(procedureName) {
    if (procedureName == null) {
        logger.error("Procedure name is blank");
        return (JSON.stringify({
            "hospitalList": []
        }));
    }

    var hospitalPromise = new Promise(function (resolve, reject) {

        hospitalModel.aggregate([
            {
                "$match": {
                    "$and": [{ "serviceActiveFlag": "Y" }, { "Treatment.name": procedureName }, { "Treatment.activeFlag": "Y" }]
                }
            },
            /* $redact is used to filter array.Above $Match will will return the entire sub document.Using $redact we can filter the subdocuments returned */
            {
                "$redact": {
                    "$cond": [
                        { "$eq": [{ "$ifNull": ["$name", procedureName] }, procedureName] },
                        "$$DESCEND",
                        "$$PRUNE"
                    ]
                }
            },
            { "$unwind": "$Treatment" },//To remove array from results populated
            /* {
                 $group: {
                     _id: "$hospitalName", "treatmentDetails": {
                         $push: { "cost": "$Treatment.costLowerBound", "procedureName": "$Treatment.name", "currency": "$Treatment.currency" }, "hospitalID": { "$first": "$hospitalID" },
                     }
                 }
             },*/
            { "$project": { "_id": 0, "hospitalName": 1,"hospitaldisplayname":1, "costStartsFrom": "$Treatment.costLowerBound", "procedureName": "$Treatment.name", "currency": "$Treatment.currency", "country": "$hospitalContact.country", "city": "$hospitalContact.City" } }
        ], function (err, result) {

            if (err) {
                logger.error("Error while reading hospitals offering " + procedureName + " treatment from from DB");
                logger.warn("Add atleast one hospital record offering " + procedureName + " to get proper display in treatments offered page")
                resolve(JSON.parse(JSON.stringify([{ "hospitalList": [] }])));
            } else if (!result.length) {
                logger.error("There are no active hospitals offering treatment " + procedureName);
                logger.warn("Add atleast one hospital record offering " + procedureName + " to get proper display in treatments offered page")
                resolve(JSON.parse(JSON.stringify([{
                    "hospitalList": []
                }])));
            }
            else {
                resolve(JSON.parse(JSON.stringify([{ "hospitalList": result }])))
            }
        })

    })
    return hospitalPromise;
}
/* Get procedure description from a file */
module.exports.getProcedureDescriptionFromFile = function (procedureFilePath) {
    return getProcedureBriefFromFile(procedureFilePath)
}
function getProcedureBriefFromFile(procedureFilePath) {

    if (procedureFilePath == null) {
        logger.error("Procedure path is blank");
        return (JSON.stringify({
            "procedureActualDescription": "Procedure path is blank"
        }));
    }

    var filePromise = new Promise(function (resolve, reject) {

       // var procedureFileDir = config.getProjectSettings('DOCDIR', 'PROCEDUREDIR', false)
        //var filePath = procedureFileDir + procedureFilePath
        var filePath =  procedureFilePath
        //var content = fs.readFileSync(filePath, "utf8");
        gridFS.getFlatFileContent(filePath, function (content) {
        if (content.indexOf("Error") > -1) {
            resolve(JSON.parse(JSON.stringify([{ "procedureActualDescription": content }])))
            logger.error("error while reading procedure description for file with path " + procedureFilePath)
        } else {
            //remove title give in the file
            var array = content.toString().split("\n");
            array[0] = ""
            content = array.join("\n")
            resolve(JSON.parse(JSON.stringify([{ "procedureActualDescription": content }])))
        }
      })
    })
    return filePromise;
}
module.exports.gethospitaltreatmentname = gethospitalrecordsfortreatmentname;
function gethospitalrecordsfortreatmentname(treatmentdisplayname,city,accreditation, next) {

  

    new Promise(function (resolve, reject) {
        //console.log("treament name is ",treatmentdisplayname)

       if ((city==null || undefined) && (accreditation==null || undefined))
       {
            hospitalModel.aggregate([
                {
                    "$match": {
                        "$and": [{ "serviceActiveFlag": "Y" }, { "Treatment.treatmentdisplayname": treatmentdisplayname }, { "Treatment.activeFlag": "Y" }]
                    }
                }, {
                    "$project": {
                        "_id": 0, "hospitalName": 1,"hospitaldisplayname":1, "hospitalimage": 1, "hospitalDescription": 1, "hospitalContact.City": 1, "hospitalContact.State": 1, "hospitalContact.country": 1, "Accreditation.agency": 1,
                        "Treatment.name": 1,"Treatment.treatmentdisplayname": 1,"Treatment.costUpperBound": 1, "Treatment.costLowerBound": 1, "Treatment.currency": 1
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
        }
        else if (accreditation==null || undefined)
        {
            hospitalModel.aggregate([
                {
                    "$match": {
                        "$and": [{ "serviceActiveFlag": "Y" }, { "Treatment.treatmentdisplayname": treatmentdisplayname }, { "Treatment.activeFlag": "Y" },{"hospitalContact.City":city}]
                    }
                }, {
                    "$project": {
                        "_id": 0, "hospitalName": 1,"hospitaldisplayname":1, "hospitalimage": 1, "hospitalDescription": 1, "hospitalContact.City": 1, "hospitalContact.State": 1, "hospitalContact.country": 1, "Accreditation.agency": 1,
                        "Treatment.name": 1,"Treatment.treatmentdisplayname": 1,"Treatment.costUpperBound": 1, "Treatment.costLowerBound": 1, "Treatment.currency": 1
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
        }
        else if (city==null || undefined)
        {
            hospitalModel.aggregate([
                {
                    "$match": {
                        "$and": [{ "serviceActiveFlag": "Y" }, { "Treatment.treatmentdisplayname": treatmentdisplayname }, { "Treatment.activeFlag": "Y" },{"Accreditation.agency":accreditation}]
                    }
                }, {
                    "$project": {
                        "_id": 0, "hospitalName": 1,"hospitaldisplayname":1, "hospitalimage": 1, "hospitalDescription": 1, "hospitalContact.City": 1, "hospitalContact.State": 1, "hospitalContact.country": 1, "Accreditation.agency": 1,
                        "Treatment.name": 1,"Treatment.treatmentdisplayname": 1,"Treatment.costUpperBound": 1, "Treatment.costLowerBound": 1, "Treatment.currency": 1
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
        }
        else
        {
            hospitalModel.aggregate([
                {
                    "$match": {
                        "$and": [{ "serviceActiveFlag": "Y" }, { "Treatment.treatmentdisplayname": treatmentdisplayname }, { "Treatment.activeFlag": "Y" },{"Accreditation.agency":accreditation},{"hospitalContact.City":city}]
                    }
                }, {
                    "$project": {
                        "_id": 0, "hospitalName": 1,"hospitaldisplayname":1, "hospitalimage": 1, "hospitalDescription": 1, "hospitalContact.City": 1, "hospitalContact.State": 1, "hospitalContact.country": 1, "Accreditation.agency": 1,
                        "Treatment.name": 1,"Treatment.treatmentdisplayname": 1,"Treatment.costUpperBound": 1, "Treatment.costLowerBound": 1, "Treatment.currency": 1
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
        }
    }).then(function (result) {
            
            next(result)
        }).catch(function (err) {
            
        next(err.message);
    })
}
function removeDuplicatesBy(keyFn, array) {
    var mySet = new Set();
    return array.filter(function(x) {
      var key = keyFn(x), isNew = !mySet.has(key);
      if (isNew) mySet.add(key);
      return isNew;
    });
  }
    