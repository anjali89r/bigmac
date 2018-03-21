/**  Multi part file upload **/
var aws = require('aws-sdk');
var multer = require('multer');
var multerS3 = require('multer-s3');
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