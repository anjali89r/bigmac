var express = require('express');
var bodyParser = require('body-parser')
var cors = require('cors')
var helmet = require('helmet')
var compression = require('compression')
var  mustacheExpress = require('mustache-express');
var serveStatic = require('serve-static');
var apicache = require('apicache');
var minifyHTML = require('express-minify-html');

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
var S3_BUCKET = 'medinovitastorage'

var upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: S3_BUCKET,
        acl: 'private',        
        serverSideEncryption: 'AES256',
        key: function (req, file, cb) {
            console.log(file);
            cb(null, Date.now().toString() + "_" +  file.originalname)
        }
    })
})
/**  Multi part file upload **/

var app = express();

var http = require('http');
var server = http.createServer(app);
app.use(compression());
// app.use(minify());
app.use(minifyHTML({
  override:      true,
  exception_url: false,
  htmlMinifier: {
      removeComments:            true,
      collapseWhitespace:        true,
      collapseBooleanAttributes: true,
      removeAttributeQuotes:     true,
      removeEmptyAttributes:     true,
      minifyJS:                  true
  }
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.disable('x-powered-by')
app.use(cors())
app.use(helmet())
const onlyStatus200 = (req, res) => res.statusCode === 200
let cache = apicache.options({
    headers: {
      'cache-control': 'no-cache'
    }
  })
  .middleware
const cacheSuccesses = cache('24 hour', onlyStatus200)
app.use(cacheSuccesses);

var mogoDBUtils = require('./controller/utilities/mongodbutils.js')
var logger = require('./controller/utilities/logger.js'); //initialize logger class

//Open db connectin
app.use((req, res, next) => {
     mogoDBUtils
    .getMogoDbCon()
    .then(conn => {
        req.conn = conn;
        next();
    })
    .catch(next);
});


/*   Route for API end point */
require('./routes/route.js')(app);//define express router for api calls

//setup server
var port = process.env.PORT || 80  //port

//app.use(express.static('./views/webcontent/', { index: 'index.html' }))//define home page
app.use(serveStatic(__dirname + '/views/webcontent/', {
    index: 'index.html',
    maxAge: '1d',
    setHeaders: setCustomCacheControl
  }))
//Setup template engine
app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', './views/webcontent/templates');

/* multipart file upload  */
app.post('/cloud/upload', upload.array('files', 5), function (req, res) {
    res.status(200).end("File is uploaded");
});

// added for 404 html ,should be called only after all routes
app.use(function(req, res, next){
    // respond with html page
    var options = {
        root: __dirname + '/views/webcontent/',
        dotfiles: 'deny',
        headers: {
            'x-timestamp': Date.now(),
            'x-sent': true
        }
      };
      res.status(404).sendFile('404Page.html', options, function (err) {
        if (err) {
          next(err);
        }
      });

  });
server.listen(port);
console.log('Listening on port ' + port + '..');
function setCustomCacheControl (res, path) {
    if (serveStatic.mime.lookup(path) === 'text/html') {
      // Custom Cache-Control for HTML files
      res.setHeader('Cache-Control', 'public, max-age=0')
    }
  }
