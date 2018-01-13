var nodemailer = require('nodemailer');
var crypto = require('../utilities/crypto.js');
var config = require('../utilities/confutils.js')
var logger = require('../utilities/logger.js');

/**************** Below function will create SMTP transport ***********/
createSMTPTransport = function (callback) {

    var emailPaswd = config.getProjectSettings('AUTOEMAIL', 'PASSWORD', false) 
    if (config.getProjectSettings('AUTOEMAIL', 'PASSWD_ENCRYPTION', false).toUpperCase()=="Y"){
        emailPaswd = crypto.decrypt(emailPaswd)
    }
    var transport = nodemailer.createTransport({
      
        service: config.getProjectSettings('AUTOEMAIL', 'SERVICE', false),       
        auth: {          
            user: config.getProjectSettings('AUTOEMAIL', 'EMAILID', false),
            pass: emailPaswd           
        }
    });

    callback(transport)
}

/**************** Below function will send html email using SMTP transport ***********/
module.exports.sendEmail = function (sendTo,subject,emailBody,htmalBodyFlag,callback) {

    new Promise(function (resolve, reject) {

        createSMTPTransport(function (callback) {
            resolve(callback)
        })

    }).then(function (transporter) {

        var mailOptions = {
            from: config.getProjectSettings('AUTOEMAIL', 'EMAILID', false), // sender address
            to: sendTo, // list of receivers as comma seperated value
            bcc: config.getProjectSettings('AUTOEMAIL', 'EMAIL_BCC', false),
            //cc:"govind84@gmail.com,nit.libin@gmail.com",
            subject: subject, // Subject line
            text: emailBody, // plain text body
            //html: htmlbody // html body
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                logger.error("error while sending email to " + sendTo + ".error is " + error.message )
            }
            logger.info('Message sent to ' + sendTo + " , " +  info.messageId);           
        });
        callback(true)
    }).catch(function (err) {
        logger.error(err.message)
    });
}