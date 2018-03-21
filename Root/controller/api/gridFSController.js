var fs = require('fs');
var Promise = require('promise');
var logger = require('../utilities/logger.js');
var config = require('../utilities/confutils.js');
var treatmentDesc = require('./treatmentDescController.js');
var costCompare = require('./costComparisonController.js');
var hospitalData = require('./hospitalDoctorDetailsController.js');
var mustache = require('mustache');
var aws = require('aws-sdk');;
aws.config.update({
    accessKeyId: process.env.ACCESSKEY,
    secretAccessKey: process.env.SECRETKEY,
    region: process.env.REGION
});
var s3 = new aws.S3();
/*Read contents of flat file */
module.exports.getFlatFileContent = getFlatFileContent;
function getFlatFileContent(filePath, next) {
    
        var params = {
            Bucket: process.env.s3filebucket, 
            Key: filePath
        };
     //  console.log("************************",filePath)
        s3.getObject(params, function(err, data) {
            if (err)
            {
                logger.error("Error while reading the file - " + err.stack.trim())
                next("Error while reading the file")

            } 
            else
            {
                next(data.Body.toString("utf8"))

            }   
            
        });

    // if (fs.existsSync(filePath)) {

    //     fs.readFile(filePath, 'utf8', function (err, contents) {            
    //         if (err) {
    //             logger.error("Error while reading the file - " + filePath)
    //             logger.error("Error while reading the file - " + err.message.trim())
    //             next("Error while reading the file")
    //         } else {
    //             next(contents);
    //         }
    //     });
    // } else {
    //     logger.error("File does not exist in path - " + filePath)
    //     next("Error - File does not Exists")
    // }
}
/*This function is used to return summary and description  */
module.exports.getProcedureDescription = function (req, res) {

    var procedureName = req.params.procedure 

    new Promise(function (resolve, reject) {
        //get the path of flat file with description
        treatmentDesc.getProcedureDetails(procedureName, function (result) {            
            var relFilePath = result[0].treatmentList[0].shortDescription //   Orthopedic/Hip Resurfacing.txt
            resolve(relFilePath)
        })

    }).then(function (relFilePath) {

       //var procedureFileDir=config.getProjectSettings('DOCDIR', 'PROCEDUREDIR', false)  
       // var filePath = procedureFileDir + relFilePath
       var filePath = relFilePath
        new Promise(function (resolve, reject) {
            getFlatFileContent(filePath, function (content) {
                
                if (content.indexOf("Error") > -1) {
                    return reject(res.status(404).json({ "Message": content }));
                } else {
                    resolve(content)
                }
            })
        }).then(function (content) {

            var newArr = [];
            var arr = content.toString().split('\n');
            var summaryClass = "<p class=\"summary\">"
            var summendTag ="</p>"

            var summFound=false
            for (var i = 0; i < arr.length; i++) {        
                if (arr[i].trim().indexOf(summaryClass) != -1) {
                    summFound = true                    
                } else if ((summFound == true) && (arr[i].trim().indexOf(summendTag) != -1)) {
                    i = arr.length + 1//exit loop                   
                } else if (summFound == true) {
                    newArr.push(arr[i])//store items in array 
                }
            }

            //join array to get procedure summary
            if (summFound == true) {
                var procedureBrief = newArr.join('\n')
            } else {
                var procedureBrief="Please use the proper template for gridFS"
            }
            var demoData = { "ProcedureBrief": procedureBrief, "procedureDetails": content };
            var rData = { records: demoData }; // wrap the data in a global object... (mustache starts from an object then parses)
            var page = fs.readFileSync("\\Medinovita\\views\\template.html", "utf8"); // bring in the HTML file
            var html = mustache.to_html(page, rData); // replace all of the data
            res.send(html);
           // return res.status(200).json({ "ProcedureBrief": procedureBrief, "procedureDetails": content});

        }).catch(function (err) {
            return res.json({ "Message": err.message });
        });

    }).catch(function (err) {
        return res.json({ "Message": err.message });
    });
}


