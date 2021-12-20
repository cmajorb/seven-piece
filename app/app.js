var express = require('express');
var http = require('http');
var path = require('path');
const fs = require('fs');
const crypto = require("crypto");
var bodyParser = require('body-parser')
const Berserker = require('./static/models/berserker.js')
const GameState = require('./static/models/gameState.js');
const Player = require('./static/models/player.js');
const sock = require('./sock.js')

var app = express();
var server = http.Server(app);
sock.start(server);

app.set('port', process.env.PORT);
app.use('/', express.static(__dirname + '/static'));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.set("view engine", "ejs");


app.get('/', function(request, response) {
    let char1 = new Berserker(); 
    char1.attack();
    response.sendFile(path.join(__dirname, 'static/index.html'));
});

app.get('/game/:id', function(request, response) {
    if(sock.joinGame(request.params.id)) {
      response.sendFile(path.join(__dirname, 'static/game.html'));
    } else {
      response.send("Game doesn't exist");
    }
    
});
app.get('/join_room', function(request, response) {
  var rooms = sock.getRoomIds();
  response.render('join_room',{"rooms": rooms});
});  

app.get("/Join_room2", function(request, response) {
  var rooms = sock.getRoomIds();
  response.render("Join_room2",{"rooms": rooms});


});


app.post('/create_room', function(request, response) {
    let mapData = fs.readFileSync('static/maps.json');
    let maps = JSON.parse(mapData);
    //var player = new Player(request.body.name);
    game = new GameState(maps.maps[request.body.map], request.body.gameSize);
    sock.addGame(game);
    response.redirect("/game/" + game.room);
    //response.sendFile(path.join(__dirname, 'static/create_room.html'));
});



server.listen(process.env.PORT, function() {
    console.log('Starting server on port '+process.env.PORT);
  });

