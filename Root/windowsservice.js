var Service = require('node-windows').Service;
//console.log(__filename);
// Prints: /Users/mjr/example.js
//$appfile=__dirname.replace("controller\\utilities","app.js");
$appfile=__dirname.concat("\\app.js");
console.log($appfile);

// Create a new service object
var svc = new Service({
  name:'Medinovita',
  description: 'medinovita web server.',
  script: $appfile
});

// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install',function(){
  svc.start();
});

svc.install();
