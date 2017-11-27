var mongoose = require('mongoose');
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
        else{
        //'_id:0 hospitalName hospitalContact Accreditation hospitalRating Treatment'
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

    }
    catch (err)
    {
        return res.status(500).json("Error in fetching the data.Please try again");
    }


}