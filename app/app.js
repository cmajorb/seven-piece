var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');
const Berserker = require('./models/berserker.js')


var app = express();
var server = http.Server(app);
var io = socketIO(server);
var refreshRate = 1000/2;

app.set('port', process.env.PORT);
app.use('/static', express.static(__dirname + '/static'));

app.get('/', function(request, response) {
    let char1 = new Berserker(); 
    char1.attack();
    response.sendFile(path.join(__dirname, 'static/index.html'));
});

server.listen(process.env.PORT, function() {
    console.log('Starting server on port '+process.env.PORT);
  });