var express = require('express');
var http = require('http');
var path = require('path');
const fs = require('fs');
var socketIO = require('socket.io');
const crypto = require("crypto");
var bodyParser = require('body-parser')
const Berserker = require('./static/models/berserker.js')
const GameState = require('./static/models/gameState.js');
const Player = require('./static/models/player.js');


var app = express();
var server = http.Server(app);
var io = socketIO(server);
var refreshRate = 1000/2;

var activeSessions = [];
var games = {};

app.set('port', process.env.PORT);
app.use('/', express.static(__dirname + '/static'));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', function(request, response) {
    let char1 = new Berserker(); 
    char1.attack();
    response.sendFile(path.join(__dirname, 'static/index.html'));
});

app.get('/game/:id', function(request, response) {
    console.log(request.params);
    response.sendFile(path.join(__dirname, 'static/game.html'));
});
app.get('/create_room', function(request, response) {
    response.redirect("/game");
    //response.sendFile(path.join(__dirname, 'static/create_room.html'));
});
app.post('/create_room', function(request, response) {
    let mapData = fs.readFileSync('static/maps.json');
    let maps = JSON.parse(mapData);
    //var player = new Player(request.body.name);
    game = new GameState(maps.maps[request.body.map], request.body.gameSize);
    games[game.room] = game;
    console.log(game);
    response.redirect("/game/" + game.room);
    //response.sendFile(path.join(__dirname, 'static/create_room.html'));
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
  });