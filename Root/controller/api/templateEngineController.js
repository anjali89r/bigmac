var fs = require('fs');
var Promise = require('promise');
var logger = require('../utilities/logger.js');
var config = require('../utilities/confutils.js');
var treatmentDesc = require('./treatmentDescController.js');
var treatmentSearch = require('./hospitaltreatmentSearchController.js');
var costCompare = require('./costComparisonController.js');
var treatmentEstimate = require('./costController.js');
var hospitalData = require('./hospitalDoctorDetailsController.js');
var holidayData = require('./holidayPackageController.js');
var gridFS = require('./gridFSController.js');
var mustache = require('mustache')
var newsSectiondata = require('./newsSectionController.js');
var enquiry = require('./userEnquiryController.js');
var currency = require('./currencyController.js');


/*This function is a demo function of the mustache template using hardcoded values.do not delete it*/
module.exports.getProcedureDescription_demo = function (req, res) {

    var procedureName = req.params.procedure

    new Promise(function (resolve, reject) {
        //get the path of flat file with description
        treatmentDesc.getProcedureDetails(procedureName, function (result) {
            if (!result.length) {               
                logger.error("Exiting getProcedureDescription function due to invalid procedure name")
                return res.redirect('/404');                
            }else{  
                var relFilePath = result[0].treatmentList[0].shortDescription //   Orthopedic/Hip Resurfacing.txt
                resolve(relFilePath)
            }
        })

    }).then(function (relFilePath) {

        //var procedureFileDir = config.getProjectSettings('DOCDIR', 'PROCEDUREDIR', false)
       // var filePath = procedureFileDir + relFilePath
       var filePath =  relFilePath
        new Promise(function (resolve, reject) {
            gridFS.getFlatFileContent(filePath, function (content) {
                //content = fs.readFileSync(filePath, "utf8");
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

            // var templateDir = '././views/webcontent/templates/procedure_template.html'
            // var rData = { records: data }; // wrap the data in a global object... (mustache starts from an object then parses)
            // var page = fs.readFileSync(templateDir, "utf8"); // bring in the HTML file
            // var html = mustache.to_html(page, data); // replace all of the data
            // res.send(html);
            res.render('procedure_template',data);
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
            if (!result.length) {               
                logger.error("Exiting getProcedureDescription function due to invalid procedure name")
                return res.redirect('/404');                
            }else{                
                var relFilePath = result[0].treatmentList[0].shortDescription //   Orthopedic/Hip Resurfacing.txt
                procedureName=result[0].treatmentList[0].displayName 
                //console.log(relFilePath)
                //console.log(procedureName)
                resolve(relFilePath)
            }
           
        })

    }).then(function (relFilePath) {

        //var procedureFileDir = config.getProjectSettings('DOCDIR', 'PROCEDUREDIR', false)
        //var filePath = procedureFileDir + relFilePath
        var filePath =  relFilePath
       // console.log("#########################################",filePath)
        new Promise(function (resolve, reject) {
            gridFS.getFlatFileContent(filePath, function (content) {
               // console.log(content)
               // content = fs.readFileSync(filePath, "utf8");
                if (content.indexOf("Error") > -1) {
                    return res.redirect('/404');
                } else {
                //    console.log("read procedure")
                    resolve(content)
                }
            })
        }).then(function (content) {         
            /* get treatment cost */ 
            /*commented out by Libin on 26-April -18 due to issue with space in procedure name*/
           /* var costComparePromise = new Promise(function (resolve, reject) {
                costCompare.getGlobalTreatmentCost(procedureName, function (costComaprisonData) {
                 //   console.log("read cost")
                    resolve(costComaprisonData)
                })
            })*/

            var topHospialPromise = new Promise(function (resolve, reject) {
                hospitalData.getTopHospitals(procedureName, function (topHospitals) {
                   // console.log("read hospitals")
                    resolve(topHospitals)
                })
            })

            var topDocPromise = new Promise(function (resolve, reject) {
                hospitalData.getTopDoctors(procedureName, function (topDoctors) {
                  //  console.log("read doctors")
                    resolve(topDoctors)
                })
            })
           // console.log("waiting")
            //console.log(costComparePromise)
            /*Promise.all([costComparePromise, topHospialPromise, topDocPromise])
                .then(([costComaprisonData, topHospitals, topDoctors]) => { */
            Promise.all([topHospialPromise, topDocPromise])
                .then(([topHospitals, topDoctors]) => { 
                   // var costComparison = costComaprisonData.countryWise
                    var tophospitaldata = topHospitals
                    var topdocdata = topDoctors
                  // console.log("all promise")
                  //  console.log(costComparePromise)
                   // console.log(topHospialPromise)
                    //console.log(topDocPromise)
                    var data = {
                        "procedure_name": procedureName,
                        "title": procedureName + ' treatments in India| Afforable & best ' + procedureName + ' treatments',
                        "procedure_gridFS_data": content,
                        "tophospitals": tophospitaldata.slice(0,5),
                        //"costdisprows": costComparison,                       
                        "topdoctors": topdocdata.slice(0,3)
                    };                    
                    res.render('procedure_template',data);
                })

        }).catch(function (err) {
            // return res.json({ "Message": err.message });
            return res.redirect('/404');
        });

    }).catch(function (err) {
        // return res.json({ "Message": err.message });
        return res.redirect('/404');
    });
}

/*    *******************************end : procedure_template.html*******************************     */

/*    ************Start : return the cost of treatment corresponding to a procedure*****************     */

module.exports.gettreatmentEstimate = function (req, res) {

    var procedureName = req.query.procedurename
    var userCurrency = req.query.currency

    new Promise(function (resolve, reject) {
        //get the path of flat file with description
        treatmentDesc.getcostProcedureDetails(procedureName, function (result) {
            var relFilePath = result[0].treatmentList[0].shortDescription // Procedure/Orthopedic/Hip Resurfacing.txt           
            resolve(relFilePath)            
        })

    }).then(function (relFilePath) {

       // var procedureFileDir = config.getProjectSettings('DOCDIR', 'PROCEDUREDIR', false)
        //var filePath = procedureFileDir + relFilePath
        
        var filePath =  relFilePath
        new Promise(function (resolve, reject) {
            gridFS.getFlatFileContent(filePath, function (content) {
               // content = fs.readFileSync(filePath, "utf8");
                if (content.indexOf("Error") > -1) {
                    return reject(res.status(404).json({ "Message": content }));
                } else {
                    resolve(content)
                }
            })
        }).then(function (content) {
            /* get treatment cost */

            var conversionRatePromise = new Promise(function (resolve, reject) {
                currency.getConversionRate(userCurrency, function (conversionrate) {                    
                    resolve(conversionrate)
                })
            })

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

            Promise.all([totalCostPromise, hospitalStayPromise, topHospitalPromise, topDocPromise, conversionRatePromise])
                .then(([estimate, hospitalStay, topHospitals, topDoctors, conversionrate]) => {
                    
                   var tophospitaldata = topHospitals.slice(0,5)
                   var topdocdata = topDoctors.slice(0,3)

                   var currencyConversionRate = conversionrate[0].conversionrate
                   var currencySymbol = conversionrate[0].symbol                                      
                   var overallTripCost = currencySymbol + (estimate.totalExpense.mediTourEstimate) * currencyConversionRate
                   var holidayPackageCost = currencySymbol +(estimate.holidayCost[0].totalPackageCost) * currencyConversionRate
                   var localCommuteCost = currencySymbol + (estimate.localTransportCost[0].totalTransportationCost ) * currencyConversionRate
                   var accomodationCost = currencySymbol + (estimate.accomodationExpense[0].totalAccomodationCost) * currencyConversionRate
                   var evisaFee = currencySymbol + estimate.visaFee[0].fee
                   var costOfProcedure = currencySymbol + (estimate.ProcedureAvarageCost[0].avarageTreatmentCost) * currencyConversionRate
                   var maxHospitalization = hospitalStay[0].treatmentList.maxHospitalization
                   maxHospitalization = Math.round(maxHospitalization + (.40 * maxHospitalization)) //add 40% buffer                   
                   var treatmentDuration = hospitalStay[0].treatmentList.minHospitalization + " to " + maxHospitalization + " days"         
                   
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
                        "tophospitals": tophospitaldata.slice(0,5),                       
                        "topdoctors": topdocdata.slice(0,3),                       
                    };
                    res.render('cost_template',data);
                })

        }).catch(function (err) {
            // return res.json({ "Message": err.message });
            return res.redirect('/404');
        });

    }).catch(function (err) {
        // return res.json({ "Message": err.message });
        return res.redirect('/404');
    });
}
/*    *******************************end : cost_template.html*******************************     */

/*    ************Start : Hospital Details of a particular hospital*****************     */
module.exports.getHospitalDescription = function (req, res) {

    var hospitalName = req.params.hospital

    new Promise(function (resolve, reject) {
        //get the path of flat file with description
        hospitalData.getHospitalBasicDetails(hospitalName, function (result) {
            resolve(result)
        })
                
    }).then(function (result) {
        var basicHospData = result
        var relFilePath = result[0].hospitalDescription //   name of text file

        //change the hospital name to actual name to query other database
        hospitalName=result[0].hospitalName
      //  var procedureFileDir = config.getProjectSettings('DOCDIR', 'HOSPITALDIR', false)
        //var filePath = procedureFileDir + relFilePath
        var filePath =  relFilePath
        new Promise(function (resolve, reject) {
            gridFS.getFlatFileContent(filePath, function (content) {
               // content = fs.readFileSync(filePath, "utf8");
                if (content.indexOf("Error") > -1) {
                    logger.warn(" Error in reading hospitals data from S3  " + hospitalName+ " redirecting to 404");
                    return res.redirect('/404');
                    //return reject(res.status(404).json({ "Message": content }));
                } else {
                    resolve(content)
                }
            })
        }).then(function (content) {  
            /* get list of procedures organized by departments */
            var treatmentsPromise = new Promise(function (resolve, reject) {               
                treatmentSearch.getDepartmentAndProcedureList(hospitalName, function (treatmentList) {                                     
                    resolve(treatmentList)                   
                })
            })

            var doctorPromise = new Promise(function (resolve, reject) {
                treatmentSearch.getTopDoctorsinHospital(hospitalName, function (doctorList) { 
                   // console.log(JSON.stringify(doctorList)  )                
                    resolve(doctorList)
                })
            })
           
            Promise.all([treatmentsPromise, doctorPromise])
                .then(([treatmentList, doctorList]) => { 
                    var idx = 0;
                    var data = {
                        "hospital_name": basicHospData[0].hospitalName,
                        "hospitalcity": basicHospData[0].hospitalcity,
                        "hospitalcountry": basicHospData[0].hospitalcountry,
                        "title": basicHospData[0].hospitalName + '|Medical treatment in India|Best & Afforable hospitals for medical treatment',
                        "hospital_gridFS_data": content,
                        "hospitalimage": basicHospData[0].hospitalimage,
                        "department": treatmentList,                        
                        "topdoctors": doctorList.slice(0,5),
                        "Accreditation": basicHospData[0].Accreditation
                    };                   
                    res.render('hospital_template',data);
                })

        }).catch(function (err) {
            // return res.json({ "Message": err.message });
            return res.redirect('/404');
        });

    }).catch(function (err) {
        // return res.json({ "Message": err.message });
        return res.redirect('/404');
    });
}

/*    ************Start : get holiday home page*****************     */
module.exports.getHolidayHomePage = function (req, res) {
   
    new Promise(function (resolve, reject) {
        //get the path of flat file with description
        holidayData.getHolidayPackageList(function (result) {
            resolve(result)
        })

    }).then(function (result) {
        var data = {
            "holidayList": result,
            "title": 'low cost medical treatment abroad',              
        };       
        res.render('holiday_home_template',data);
    }).catch(function (err) {
        // return res.json({ "Message": err.message });
        return res.redirect('/404');
    });
}

/*    ************Start : get holiday description page*****************     */
module.exports.getHolidayDescriptionPage = function (req, res) {

    var holidayPackageName = req.params.holidaypackage

    new Promise(function (resolve, reject) {
        //get the path of flat file with description
        holidayData.getIndividualHolidayPackageData(holidayPackageName,function (result) {
            resolve(result)
        })

    }).then(function (result) {      
        var relFilePath = result[0].packageDescription //   name of text file
       // var procedureFileDir = config.getProjectSettings('DOCDIR', 'HOLIDAYLDIR', false)
        //var filePath = procedureFileDir + relFilePath
        var filePath =  relFilePath
       // console.log(filePath)
        new Promise(function (resolve, reject) {
            gridFS.getFlatFileContent(filePath, function (content) {
               // content = fs.readFileSync(filePath, "utf8");
                if (content.indexOf("Error") > -1) {
                    return reject(res.status(404).json({ "Message": content }));
                } else {
                    resolve(content)
                }
            })
        }).then(function (content) {
            /* get list of procedures organized by departments */
               var data = {
                        "holidayList": result,
                        "title": result[0].packageShortName + ' | Holiday Packages', 
                        "packageShortName": result[0].packageShortName,
                        "packageDuration": result[0].packageDuration,
                        "packageCost": result[0].packageCost,
                        "currency": result[0].currency,
                        "packageImageDir": result[0].packageImageDir,
                        "gridFS_holidayDescription": content
                    };                   
                    res.render('holiday_description_template',data);
               
        }).catch(function (err) {
            // console.log(err.message);
            logger.error("Error rendering holiday template : - " + err.message)
            return res.redirect('/404');
        });

    }).catch(function (err) {
       // console.log(err.message);
        return res.redirect('/404')
    });
}

module.exports.getnewsSectionbyid = function (req, res) {
     new Promise(function (resolve, reject) {
        //get the path of flat file with description
        newsSectiondata.getnewsSectiontemplate(req.params.newsid,function(result) {
            resolve(result)
        })
        }).then(function(result) {
        var temparray = result.filter(function (el) {
            return el.newsId == req.params.newsid;
        });
        var newsarray = result.filter(function (el) {
            return el.newsId != req.params.newsid;
        });
        var data = temparray[0];
        data.newsdetails=[];
        newsarray.forEach(function(key)
        {
            data.newsdetails.push({"newsHeading":key.postHeading,"newsId": key.newsId });
        });
        res.render('newstemplate',data);
        }).catch(function (err) {
        return  res.redirect('/404')
    });
        
}
/*    ************Start : get treatments offered sub page*****************     */
/* Data requirements
  1. Department and procedures should be available under treatments offered descriptions collection
  2.Every procedure added under treatments offered descriptions collection should have an entry in hospitals and doctor details table
  3.Description of the procedure should be available in txt file as per the path given in db
*/

module.exports.getDepartmentwiseTreatmentDescription = function (req, res) {

    var department = req.params.department

    var reqbody=req.body;
    
    new Promise(function (resolve, reject) {
        //get the path of flat file with description
        treatmentDesc.getTreatmentDetailsDepartmentwiseWithCost(department, reqbody, function (result) {
            resolve(result)
        })

    }).then(function (result) {
        /* Department Description */
        var relFilePath = result[0].departmentDescription //name of text file
        //var procedureFileDir = config.getProjectSettings('DOCDIR', 'DEPARTMENTDIR', false)
        //var filePath = procedureFileDir + relFilePath
      
        var filePath =  relFilePath
        new Promise(function (resolve, reject) {
            gridFS.getFlatFileContent(filePath, function (content) {
                //content = fs.readFileSync(filePath, "utf8").trim()
                if (content == null) {
                    content="Description not available"
                }
                if (content.indexOf("Error") > -1) {
                    logger.error("Error retrieving department details from DB : - " + department +  err.message)
                    return  res.redirect('/404')
                    //return reject(res.status(404).json({ "Message": content }));
                } else {
                    resolve(content)
                }
            })
        }).then(function (content) {
            /* get list of procedures organized by departments */
            var data = {
                "department": department,
                "title": department + ' treatments in India|Medical hospitals in India',
                "departmentDescription": content,
                "treatmentList": result[0].treatmentList,
                "procedureCount": result[0].treatmentList.length,
                "maxHospitalization": result[0].minHospitalization,
                "healingTimeInDays": result[0].healingTimeInDays,
                "procedureCost": result[0].procedureCost,
                "procedureImagepath": result[0].procedureImagepath,
                "firstProcedureName": result[0].treatmentList[0].procedureNameAttr,
                "procedureNameAttr": result[0].procedureNameAttr,
                "procedureCount": result[0].treatmentList.length,
                "distHospitalList": result[0].distHospitalList,
                "distCityList": result[0].distCityList,
                "distProcedure": result[0].distProcedure,
                "cheapestCost": result[0].distCostList[0].costStartsFrom,
                "maxCost": result[0].distCostList[result[0].distCostList.length - 1].costStartsFrom

            };
            res.render('treatments_offered_template', data);

        }).catch(function (err) {
            return res.redirect('/404');
        });

    }).catch(function (err) {
        return res.redirect('/404');
    });
}

/*    ************Start : get treatments offered sub page*****************     */
module.exports.getDepartmentwiseTreatmentDescription1 = function (req, res) {
  
    var treatmentname = req.params.treatmentname;
    //console.log(treatmentname)
    return res.redirect('/404');
}

module.exports.searchhospitalsbytreatment = function(req,res)
{
    var treatmentdisplayname = req.params.treatmentname;
    var treatmentname = ""; // to be hold the actual treatment name like Bone Grafting . This value to be populated from db
    var city =req.query.city;
    var accreditation=req.query.accreditation;
    //console.log(treatmentdisplayname);  
    var data = {
        "treatmentname": treatmentdisplayname,
        "title": treatmentdisplayname + ' | Medical treatments in India | Medinovita',
        "treatmenturlname":treatmentdisplayname,
        "hospitaldetails": [],
        "treatmentDescription": "",
        "city": [],
        "accreditationdetails":[],
        
         }; 
        
    new Promise(function (resolve, reject) {
        //get the path of flat file with description
        treatmentSearch.gethospitaltreatmentname(treatmentdisplayname,city,accreditation, function(result) {
            resolve(result)
            //console.log(result)
        })

        }).then(function(result) {
            /* Department Description */
           
                    result.forEach(function(key)
                    {
                        var jciimage=false;
                        var nabhimage=false;
                        var nablimage=false;
                        key.Accreditation.forEach(function(agencylist)
                        {
                        
                            switch (agencylist.agency)
                            {
                                case "JCI":
                                     jciimage=true;
                                    break;
                                case "NABH":
                                   nabhimage = true;
                               
                                    break;
                                case "ISO9001":
                        
                                      nablimage= true;
                                    
                                    break;
                            }
                        });
                        
                        data.hospitaldetails.push({"hospitalName":key.hospitalName,"hospitaldisplayname":key.hospitaldisplayname,"hospitalimage": key.hospitalimage,"hospitaldescription": key.hospitalDescription,"hospitalCity": key.hospitalContact.City,"hospitalState": key.hospitalContact.State,"hospitalcountry": key.hospitalContact.country,"currency":key.Treatment[key.Treatment.findIndex(x => x.treatmentdisplayname === treatmentdisplayname)].currency,"costLowerBound" : key.Treatment[key.Treatment.findIndex(x => x.treatmentdisplayname === treatmentdisplayname)].costLowerBound,"jciimage":jciimage,"nabhimage":nabhimage,"nablimage":nablimage });
                        treatmentname=key.Treatment[key.Treatment.findIndex(x => x.treatmentdisplayname === treatmentdisplayname)].name;
                    }); 
                         
                    result.forEach(function(contactkey)

                    {
                       
                            if (data.city.findIndex(y => y.cityname===contactkey.hospitalContact.City) === -1)
                            {
                                data.city.push({"cityname": contactkey.hospitalContact.City,"citycount": 1});
                            }
                            else
                            {
                                data.city[data.city.findIndex(y => y.cityname===contactkey.hospitalContact.City)].citycount+=1;
                                
                            }
                    });
                    result.forEach(function(acckey)
                    {
                        acckey.Accreditation.forEach(function(accreditationkey)
                        {
                          
                            if (data.accreditationdetails.findIndex(y => y.accreditationagency===accreditationkey.agency) === -1)
                            {
                                data.accreditationdetails.push({"accreditationagency":accreditationkey.agency,"accreditationagencycount": 1});
                            }
                            else
                            {
                                
                                data.accreditationdetails[data.accreditationdetails.findIndex(y => y.accreditationagency===accreditationkey.agency)].accreditationagencycount+=1;
                                
                            }
                            
                        });
                        
                    });
                   
                  // console.log("i'm here ",treatmentname);
            new Promise(function (resolve, reject) {
                //get the path of flat file with description
              //  console.log(treatmentdisplayname)
                treatmentDesc.getProcedureDetails(treatmentdisplayname, function (procedureresult) {
                    if (!procedureresult.length) {               
                        logger.error("Exiting getProcedureDescription function due to invalid procedure name")
                        return res.redirect('/404');                
                    }else{  
                        var relFilePath = procedureresult[0].treatmentList[0].shortDescription //   Orthopedic/Hip Resurfacing.txt
                    // console.log(relFilePath)
                        //console.log(procedureresult[0])
                        resolve(relFilePath)
                    }
                })
               
            }).then(function (relFilePath) {
                   
                   
               // var procedureFileDir = config.getProjectSettings('DOCDIR', 'PROCEDUREDIR', false)
                //var filePath = procedureFileDir + relFilePath
                var filePath =  relFilePath
                //console.log(filePath)
                new Promise(function (resolve, reject) {
                    gridFS.getFlatFileContent(filePath, function (procedurecontent) {
                       // procedurecontent = fs.readFileSync(filePath, "utf8");
                        if (procedurecontent.indexOf("Error") > -1) {
                            //console.log(procedurecontent)
                            logger.error("Error retrieving procedure contents : - " + procedurecontent )
                            return  res.redirect('/404')
                        } else {
                            resolve(procedurecontent)
                        }
                    })
                }).then(function (procedurecontent) {
                /* get list of procedures organized by departments */
               // console.log(procedurecontent)
               // set description content
                   data.treatmentDescription=procedurecontent;
                  //console.log(procedurecontent)
                  // set treatment name without hypen
                   data.treatmentname=treatmentname;
                   data.title=treatmentname + "|Best hospitals & doctors in India|Medinovita";

                   res.render('searchtreatment_template', data);
                }).catch(function (err) {
                    logger.error("Error retrieving treatment details from DB : - " + err.message)
                    // console.log("first catch " + err)
                    return res.redirect('/404');
                });

            }).catch(function (err) {
                logger.error("Error retrieving treatment details from DB : - " + err.message)
                return res.redirect('/404');
            });
               
               
        }).catch(function(err)
        {
            logger.error("Error retrieving treatment details from DB : - " + err.message)
            return res.redirect('/404');
        });
}
/*    ************Start : get enquiry details page*****************     */
module.exports.getPendingEnquiriesPage = function (req, res) {
    
    new Promise(function (resolve, reject) {
        //get pending enquiries 
        enquiry.getPendingEnquiryDetails(function (result) {           
            resolve(result)
        })

    }).then(function (result) {       
            var data = {
                "enquirylist": result,  
                "enquirycount": Object.keys(result).length,
                index: function () {
                    return (data.enquirylist[0].enquiry.indexOf(this)) + 1;
                },
                options: [
                    { val: 1, txt: 'Enquiry Received' },
                    { val: 2, txt: 'Response Sent' },
                    { val: 3, txt: 'Followup Needed' },
                    { val: 4, txt: 'In Progress' },
                    { val: 5, txt: 'Undergoing Treatment' },
                    { val: 6, txt: 'Request Cancelled' },
                    { val: 7, txt: 'Closed' }
                ],     
                selected: function () {
                    return function (text, render) {
                        if (this.txt == render(text)) {                            
                            return "selected";
                        } else {
                            return "";
                        }
                    }
                }
            };
            res.render('user_enquiry_details', data);       
    }).catch(function (err) {
      //  console.log(err.message);
      logger.error("Error in user enquiry details document")
        return res.redirect('/404')
    });
}

