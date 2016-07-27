var server = require('./modules/server.js');
var config = require('./modules/config.js');

process.chdir(__dirname);
server.start();