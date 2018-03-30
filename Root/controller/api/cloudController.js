/**  Multi part file upload **/
var aws = require('aws-sdk');
var logger = require('../utilities/logger.js');
var fs = require('fs')
var multer = require('multer');
var multerS3 = require('multer-s3');

/**  Multi part file upload **/
var uploadservice = multer({ storage: multer.memoryStorage(), limits: { fileSize: 1000 * 1000 * 12 } }).array("files", 5);

aws.config.update({
    accessKeyId: process.env.ACCESSKEY,
    secretAccessKey: process.env.SECRETKEY,
    region: process.env.REGION
});

var s3 = new aws.S3();
var S3_BUCKET = 'medinovitastorage';

var upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: S3_BUCKET,
        acl: 'private',        
        serverSideEncryption: 'AES256',
        key: function (req, file, cb) {
           // console.log(file);
            cb(null, Date.now().toString() + "_" +  file.originalname)
        }
    })
}).array('files',5)
/**  Multi part file upload **/
module.exports.uploadfile = function (req, res,next) {
    //console.log("I'm here")
    upload(req,res,function(err) {
        if (err) {
            logger.error("Error uploading data into s3 bucket " + err.message)
            res.status(500).end("Error in uploading files"); 
        }    
        // Everything went fine
        res.status(200).end("File is uploaded");
      })
    
    }
	
/*  Function to download all files stored in S3 */
module.exports.downloadcloudFiles=function(req,res) {
      
    var filename = req.body.fileName
    getPreSignedUrlS3(filename, function (url) {        
        res.end(JSON.stringify({
            URL: url })	)
    })
       
}

/*  Function to download single files stored in S3 */
function downloadFileFromS3 (filename) {
    getPreSignedUrlS3(filename)

    var S3_BUCKET = 'medinovitastorage'

    var s3 = new AWS.S3({
        accessKeyId: process.env.ACCESSKEY,
        secretAccessKey: process.env.SECRETKEY,
        region: process.env.REGION
    });

    var os = require('os');

    localFileName = os.homedir() + "\\" + "Downloads" + "\\" + filename,

    file = fs.createWriteStream(localFileName);
    s3.getObject({
        Bucket: S3_BUCKET,
        Key: filename
    }).createReadStream()
    .on('error', function (err) {
        //res.end("File download failed with error " + err.message);
        logger.error("File " + filename + " download failed with error " + err.message)
        file.end();
    })
    .on('httpData', function (chunk) {
        file.write(chunk);
    })
    .on('httpDone', function () {
        file.end();          
    }).pipe(file)

    logger.info("File " + filename + " download is success")
    
}

/*  Function to get presigned url from S3 */
function getPreSignedUrlS3(filename,callback) {

    var S3_BUCKET = 'medinovitastorage';

    params = { Bucket: S3_BUCKET, Key: filename, Expires: 500 }
   
    s3.getSignedUrl('getObject', params, function (err, url) {

        if (err) {
            logger.error("Unable to get presigned url for file " + filename + " due to " + err.message)
            callback(null)
        } else {
            logger.info("Presigned url fetch was successful")
            callback(url);
        }
    });

}
/*   ZIP and upload files to s3 using multer    */
module.exports.ZipAndUploadToS3WithMulter = function (req, res, next) {  
    var enqid = req.params.enqid    
   uploadservice(req, res, function (err) {
       if (err) {           
           logger.error("error - " + err)
           res.status(200).end("File upload is failure due to - " + err); 
       } else { 
           var files = req.files                    
            var JSZip = require("jszip");
            var zip = new JSZip();                 
            for (i = 0; i < files.length; i++){              
                zip.file(files[i].originalname, files[i].buffer, { base64: true });
            }              
           zip.generateAsync({
               type: "nodebuffer",
               compression: "DEFLATE",                          
           }).then(function (content) {                  
               var S3_BUCKET = 'medinovitastorage'
               s3.putObject({
                   ACL: 'private',
                   Bucket: S3_BUCKET,
                   Key: enqid + ".zip",
                  // serverSideEncryption: 'AES256',
                   Body: content,
                   ContentType: "application/zip"
               }, function (error, response) {
                   if (error) {
                       logger.error("error while uploading files to S3 using multer -  " + error)
                       res.status(200).end("AWS File upload failed"); 
                   } else {
                       logger.info("AWS file upload is success")
                       res.status(200).end("File is uploaded successfully"); 
                   } 
               });
           }) 
        }
    });     
}
