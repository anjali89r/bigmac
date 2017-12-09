﻿var mongoose = require('mongoose');
var Promise = require('promise');
var logger = require('../utilities/logger.js');
require('../../model/hospitalDoctorDetailsModel.js');
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

                console.log(result.length);
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

                console.log(result.length);
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
                    $push: { "procedureName": "$Treatment.name", "cost": "$Treatment.costLowerBound" }
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
                "docdescription": "$Treatment.doctor.doctorDescription",
                "docspeciality": "$Treatment.doctor.speciality.specialityName",
                "docpicdir": "$Treatment.doctor.profilepicdir",
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
