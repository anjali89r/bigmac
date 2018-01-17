var mongoose = require('mongoose');
var Promise = require('promise');
var logger = require('../utilities/logger.js');
require('../../model/treatmentsOfferedModel.js');
var treatmentModel = mongoose.model('treatments_offered');
var counterSchema = require('../../model/identityCounterModel.js');

const collection = 'treatments_offered';


/* **************Add new procedure details or get the procedure id from treatments schema ***************** */
module.exports.createTreatmentRecord = function (paramDict, callback) {

    var treatmentOfferedSchema = new treatmentModel();

    var procedureId = paramDict['procedureId'];
    var procedureMedicalName = paramDict['procedureMedicalName'];
    var procedureShortName = paramDict['procedureShortName'];
    var procedureaboutFilename = paramDict['procedureaboutFilename'];
    var procedureparentDepartment = paramDict['procedureparentDepartment'];
    var procedureparentDepartmentid = paramDict['procedureparentDepartmentid'];


    treatmentModel.find({ "procedureMedicalName": procedureMedicalName }, { "procedureId": 1, "_id": 0 }, function (err, doc) {//{ $set: { <field1>: <value1>, ... } }
        if (err) {
            logger.error("Error while updating record in treatments offered schema : - " + err.message);
            callback();
        } else if (doc[0]!= null) {
            logger.info("Procedure " + procedureMedicalName + "already exists in treatments offered collection");
            callback(doc[0].procedureId) ;
        } else if (doc[0] == null || typeof (doc[0]) == 'undefined') {
            treatmentOfferedSchema.procedureId = procedureId;
            treatmentOfferedSchema.procedureMedicalName = procedureMedicalName;
            treatmentOfferedSchema.procedureShortName = procedureShortName;
            treatmentOfferedSchema.procedureaboutFilename = procedureaboutFilename;
            treatmentOfferedSchema.procedureparentDepartment = procedureparentDepartment;
            treatmentOfferedSchema.procedureparentDepartmentid = procedureparentDepartmentid;

            treatmentOfferedSchema.save(function (error, data) {
                if (error) {
                    logger.error("Error while inserting record : - " + error.message);                   
                }                
            });
            logger.info(procedureMedicalName + " Data has been added successfully to treatments offered model");
            callback(procedureId);
        } else {
            callback(procedureId);
        }        
    });
}
/* **************Get Procedure id,department id from treatments schema ***************** */
module.exports.isTreatmentExists = function (procedureMedicalName,callback) {

    var dict = [];
    
    treatmentModel.find({ "procedureMedicalName": procedureMedicalName }, {
        "procedureId": 1,"procedureparentDepartmentid":1, "_id": 0 }, function (err, doc) {//{ $set: { <field1>: <value1>, ... } }
        if (err) {
            logger.error("Error while reading procedure id,department id from treatments offered schema : - " + err.message);
            callback(dict);
        } else if (doc[0] != null || typeof (doc[0]) != 'undefined') {    
            logger.info("Procedure " + procedureMedicalName + " already exists in treatments offered collection");
            dict["procedureId"] = doc[0].procedureId;
            dict["procedureparentDepartmentid"] = doc[0].procedureparentDepartmentid;            
            callback(dict);
        } else  {
            callback(dict);
        }        
    });
}