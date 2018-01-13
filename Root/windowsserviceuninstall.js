var Service = require('node-windows').Service;
$appfile=__dirname.concat("\\app.js");
// Create a new service object
var svc = new Service({
  name:'Medinovita',
  script: $appfile
});

// Listen for the "uninstall" event so we know when it's done.
svc.on('uninstall',function(){
  console.log('Uninstall complete.');
  console.log('The service exists: ',svc.exists);
});

// Uninstall the service.
svc.uninstall();
