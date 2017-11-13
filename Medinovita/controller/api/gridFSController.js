var fs = require('fs');
var Promise = require('promise');
var logger = require('../utilities/logger.js');
var config = require('../utilities/confutils.js');
var treatmentDesc = require('./treatmentDescController.js');

/*Read contents of flat file */
module.exports.getFlatFileContent = getFlatFileContent;
function getFlatFileContent(filePath, next) {
        
    if (fs.existsSync(filePath)) {

        fs.readFile(filePath, 'utf8', function (err, contents) {
            if (err) {
                logger.error("Error while reading the file - " + filePath)
                logger.error("Error while reading the file - " + err.message.trim())
                next("Error while reading the file")
            } else {
                next(contents);
            }
        });
    } else {
        logger.error("File does not exist in path - " + filePath)
        next("Error - File does not Exists")
    }
}
/*This function is used to return summary and description  */
module.exports.getProcedureDescription = function (req, res) {

    var procedureName = req.params.procedure 

    new Promise(function (resolve, reject) {
        //get the path of flat file with description
        treatmentDesc.getProcedureDetails(procedureName, function (result) {            
            var relFilePath = result[0].treatmentList[0].treatmentDescription //   Orthopedic/Hip Resurfacing.txt
            resolve(relFilePath)
        })

    }).then(function (relFilePath) {

        var procedureFileDir=config.getProjectSettings('DOCDIR', 'PROCEDUREDIR', false)  
        var filePath = procedureFileDir + relFilePath

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
            return res.status(200).json({ "ProcedureBrief": procedureBrief, "procedureDetails": content});

        }).catch(function (err) {
            return res.json({ "Message": err.message });
        });

    }).catch(function (err) {
        return res.json({ "Message": err.message });
    });
}