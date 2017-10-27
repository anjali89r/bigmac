var express = require('express');
var bodyParser = require('body-parser')
var cors = require('cors')
var helmet = require('helmet')

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.disable('x-powered-by')
app.use(cors())
app.use(helmet())
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

app.use(express.static('./views/webcontent/', { index: 'index.html' }))//define home page

app.listen(port);
console.log('Listening on port ' + port + '..');
