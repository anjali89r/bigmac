var fs = require('fs');
var Promise = require('promise');
var logger = require('../utilities/logger.js');
var config = require('../utilities/confutils.js');
var treatmentDesc = require('./treatmentDescController.js');
var costCompare = require('./costComparisonController.js');
var treatmentEstimate = require('./costController.js');
var hospitalData = require('./hospitalDoctorDetailsController.js');
var gridFS = require('./gridFSController.js');
var mustache = require('mustache')


/*This function is a demo function of the mustache template using hardcoded values.do not delete it*/
module.exports.getProcedureDescription_demo = function (req, res) {

    var procedureName = req.params.procedure

    new Promise(function (resolve, reject) {
        //get the path of flat file with description
        treatmentDesc.getProcedureDetails(procedureName, function (result) {
            var relFilePath = result[0].treatmentList[0].shortDescription //   Orthopedic/Hip Resurfacing.txt
            resolve(relFilePath)
        })

    }).then(function (relFilePath) {

        var procedureFileDir = config.getProjectSettings('DOCDIR', 'PROCEDUREDIR', false)
        var filePath = procedureFileDir + relFilePath

        new Promise(function (resolve, reject) {
            gridFS.getFlatFileContent(filePath, function (content) {
                content = fs.readFileSync(filePath, "utf8");
                if (content.indexOf("Error") > -1) {
                    return reject(res.status(404).json({ "Message": content }));
                } else {
                    resolve(content)
                }
            })
        }).then(function (content) {

            var costComparison = [
                {
                    rowindex: '1',
                    country: 'India',
                    treatmentcost: '1000$',
                },
                {
                    rowindex: '2',
                    country: 'USA',
                    treatmentcost: '10000$',
                },
                {
                    rowindex: '3',
                    country: 'UK',
                    treatmentcost: '12000$',
                }
            ];

            var tophospitaldata = [
                {
                    hospitalname: 'Appolo Hospital',
                    hospitalcity: 'Chennai',
                    hospitalcountry: 'India'
                },
                {
                    hospitalname: 'Aster Medicity',
                    hospitalcity: 'Kochi',
                    hospitalcountry: 'India'
                },
                {
                    hospitalname: 'Renai Medicity',
                    hospitalcity: 'Kochi',
                    hospitalcountry: 'India'
                }
            ];

            var topdocdata = [
                {
                    docname: 'Dr.Govind',
                    docspeciality: 'MBBS',
                }
            ];

            var data = {
                "procedure_name": 'Bone Grafting',
                "title": 'Bone Grafting in India|low cost Bone Grafting abroad',
                "procedure_gridFS_data": content,
                "tophospitals": tophospitaldata,
                "costdisprows": costComparison,
                "topdoctors": topdocdata
            };

            var templateDir = '././views/webcontent/templates/procedure_template.html'
            var rData = { records: data }; // wrap the data in a global object... (mustache starts from an object then parses)
            var page = fs.readFileSync(templateDir, "utf8"); // bring in the HTML file
            var html = mustache.to_html(page, data); // replace all of the data
            res.send(html);
            // return res.status(200).json({ "ProcedureBrief": procedureBrief, "procedureDetails": content});

        }).catch(function (err) {
            return res.json({ "Message": err.message });
        });

    }).catch(function (err) {
        return res.json({ "Message": err.message });
    });
}
/*   *******************************procedure_template.html*******************************     */

/*This function is used to create the html page details the summary of a particular treatment */

/*          Data requirement for API

* Make sure that hsopital and doctors offering the procedure passed as parameter exits in hospitalDoctorDetails table
  use '/api/v1/add/hospitalrecord/:apiTokenName' to create new hospital record

*Ensure that treatmentoffered_descriptions table has an entry for the procedure passed as parameter and shortDescription filed
 is updated with the path of the text file contains treatment details in html format. eg Orthopedic/Bone_Replacement.txt

*create cost of particalar procedures in various countries in $ in treatment_cost_comparisons.Atleast data for India
 use '/api/v1/post/globaltreatmentcost/:apiTokenName' to create new entry

* Document having proper description should be updated in the designated foler.refer settings.json for the placement of file
                                                            */
module.exports.getProcedureDescription = function (req, res) {

    var procedureName = req.params.procedure

    new Promise(function (resolve, reject) {
        //get the path of flat file with description
        treatmentDesc.getProcedureDetails(procedureName, function (result) {
            var relFilePath = result[0].treatmentList[0].shortDescription //   Orthopedic/Hip Resurfacing.txt
            resolve(relFilePath)
        })

    }).then(function (relFilePath) {

        var procedureFileDir = config.getProjectSettings('DOCDIR', 'PROCEDUREDIR', false)
        var filePath = procedureFileDir + relFilePath
        new Promise(function (resolve, reject) {
            gridFS.getFlatFileContent(filePath, function (content) {
                content = fs.readFileSync(filePath, "utf8");
                if (content.indexOf("Error") > -1) {
                    return reject(res.status(404).json({ "Message": content }));
                } else {
                    resolve(content)
                }
            })
        }).then(function (content) {         
            /* get treatment cost */
            var costComparePromise = new Promise(function (resolve, reject) {
                costCompare.getGlobalTreatmentCost(procedureName, function (cost) {
                    resolve(cost)
                })
            })

            var topHospialPromise = new Promise(function (resolve, reject) {
                hospitalData.getTopHospitals(procedureName, function (topHospitals) {
                    resolve(topHospitals)
                })
            })

            var topDocPromise = new Promise(function (resolve, reject) {
                hospitalData.getTopDoctors(procedureName, function (topDoctors) {
                    resolve(topDoctors)
                })
            })

            Promise.all([costComparePromise, topHospialPromise, topDocPromise])
                .then(([costComaprisonData, topHospitals, topDoctors]) => {
                    var costComparison = costComaprisonData.countryWise
                    var tophospitaldata = topHospitals
                    var topdocdata = topDoctors

                    var data = {
                        "procedure_name": procedureName,
                        "title": procedureName + ' in India|low cost ' + procedureName+ ' abroad',
                        "procedure_gridFS_data": content,
                        "tophospitals": tophospitaldata,
                        "costdisprows": costComparison,
                        "topdoctors": topdocdata
                    };

                    var templateDir = '././views/webcontent/templates/procedure_template.html'
                    var rData = { records: data }; // wrap the data in a global object... (mustache starts from an object then parses)
                    var page = fs.readFileSync(templateDir, "utf8"); // bring in the HTML file
                    var html = mustache.to_html(page, data); // replace all of the data
                    res.send(html);
                })

        }).catch(function (err) {
            return res.json({ "Message": err.message });
        });

    }).catch(function (err) {
        return res.json({ "Message": err.message });
    });
}

/*    *******************************end : procedure_template.html*******************************     */

/*    ************Start : return the cost of treatment corresponding to a procedure*****************     */

module.exports.gettreatmentEstimate = function (req, res) {

    var procedureName = req.query.procedurename

    new Promise(function (resolve, reject) {
        //get the path of flat file with description
        treatmentDesc.getProcedureDetails(procedureName, function (result) {
            var relFilePath = result[0].treatmentList[0].shortDescription //   Orthopedic/Hip Resurfacing.txt
            resolve(relFilePath)
        })

    }).then(function (relFilePath) {

        var procedureFileDir = config.getProjectSettings('DOCDIR', 'PROCEDUREDIR', false)
        var filePath = procedureFileDir + relFilePath
        new Promise(function (resolve, reject) {
            gridFS.getFlatFileContent(filePath, function (content) {
                content = fs.readFileSync(filePath, "utf8");
                if (content.indexOf("Error") > -1) {
                    return reject(res.status(404).json({ "Message": content }));
                } else {
                    resolve(content)
                }
            })
        }).then(function (content) {
            /* get treatment cost */

            var totalCostPromise = new Promise(function (resolve, reject) {
                treatmentEstimate.getTreatmentRoughEstimate(req, res, function (estimate) {
                    resolve(estimate)
                })
            })
            
            var topHospitalPromise = new Promise(function (resolve, reject) {
                hospitalData.getTopHospitals(procedureName, function (topHospitals) {
                    resolve(topHospitals)
                })
            })

            var topDocPromise = new Promise(function (resolve, reject) {
                hospitalData.getTopDoctors(procedureName, function (topDoctors) {
                    resolve(topDoctors)
                })
            })
            
            var hospitalStayPromise = new Promise(function (resolve, reject) {
                treatmentEstimate.getHospitalStayDuration(procedureName, function (hospitalStay) {             
                    resolve(hospitalStay)
                })
            })

            Promise.all([totalCostPromise, hospitalStayPromise, topHospitalPromise, topDocPromise])
                .then(([estimate, hospitalStay, topHospitals, topDoctors]) => {
                    
                   var tophospitaldata = topHospitals
                   var topdocdata = topDoctors
              
                   var overallTripCost=estimate.totalExpense.mediTourEstimate
                   var holidayPackageCost = estimate.holidayCost[0].totalPackageCost
                   var localCommuteCost = estimate.localTransportCost[0].totalTransportationCost
                   var accomodationCost = estimate.accomodationExpense[0].totalAccomodationCost
                   var evisaFee = estimate.visaFee[0].fee
                   var costOfProcedure = estimate.ProcedureAvarageCost[0].avarageTreatmentCost                    
                   var treatmentDuration = hospitalStay[0].treatmentList.minHospitalization + " to " + hospitalStay[0].treatmentList.maxHospitalization + " days"         
                   var data = {
                        "totalCost": overallTripCost,
                        "holidayPkgCost": holidayPackageCost,
                        "localCommuteCost": localCommuteCost,
                        "accomodationCost": accomodationCost,
                        "costOfProcedure": costOfProcedure,
                        "treatmentduration": treatmentDuration,
                        "visaFee": evisaFee,
                        "procedure_name": procedureName,                        
                        "title": procedureName + ' in India|low cost ' + procedureName + ' abroad',
                        "procedure_gridFS_data": content,
                        "tophospitals": tophospitaldata,                       
                        "topdoctors": topdocdata,                       
                    };

                    var templateDir = '././views/webcontent/templates/cost_template.html'
                    var rData = { records: data }; // wrap the data in a global object... (mustache starts from an object then parses)
                    var page = fs.readFileSync(templateDir, "utf8"); // bring in the HTML file
                    var html = mustache.to_html(page, data); // replace all of the data
                    res.send(html);
                })

        }).catch(function (err) {
            return res.json({ "Message": err.message });
        });

    }).catch(function (err) {
        return res.json({ "Message": err.message });
    });
}