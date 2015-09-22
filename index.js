var express = require('express');               // Get the express framework
var app     = express();                        // Create our app
var http    = require('http').Server(app);      // HTTP server
var io      = require('socket.io')(http);       // Socket library
var hrm     = require('./hrm.js');

// Set up the images directory
app.use(express.static('publics'));

// Set up default route
app.get('/', function(request, response) {
    response.sendFile(__dirname + '/index.html');
});

// Start the heart rate monitor
console.log(hrm);
hrm.start(io);

// Start the http server
http.listen(3000, function() {
    console.log('listening on *:3000');
});