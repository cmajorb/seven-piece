var express = require('express');
var http = require('http');
var path = require('path');
const fs = require('fs');
var socketIO = require('socket.io');
const crypto = require("crypto");
const Berserker = require('./static/models/berserker.js')
const GameState = require('./static/models/gameState.js')


var app = express();
var server = http.Server(app);
var io = socketIO(server);
var refreshRate = 1000/2;

var activeSessions = [];
var games = [];

app.set('port', process.env.PORT);
app.use('/', express.static(__dirname + '/static'));

app.get('/', function(request, response) {
    let char1 = new Berserker(); 
    char1.attack();
    response.sendFile(path.join(__dirname, 'static/index.html'));
});

app.get('/game', function(request, response) {
    response.sendFile(path.join(__dirname, 'static/game.html'));
});

server.listen(process.env.PORT, function() {
    console.log('Starting server on port '+process.env.PORT);
  });

  io.on('connection', function(socket) {
    socket.on('start-session', function(data) {
        let mapData = fs.readFileSync('static/maps.json');
        let maps = JSON.parse(mapData);
        socket.join("mainRoom");
        io.to("mainRoom").emit('init', maps.maps[0]);
        //socket.emit("set-session-acknowledgement", data);
        console.log("start-session");
    });


    socket.on('disconnect', function () {
      console.log("Disconnected");
  
    });
    socket.on('click', function(coor,data) {
      console.log("clicked " + coor.x + "," + coor.y);
    });
    socket.on('player connect', function(data) {
        console.log("Connected");
    });
    socket.on('createRoom', function(map,name) {
        game = new GameState(map,name);
        games.push(game);
      });
  });