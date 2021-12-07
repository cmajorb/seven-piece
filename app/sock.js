var socketIO = require('socket.io');
const fs = require('fs');

games = {};

function start(server) {
  const io = socketIO(server);

  io.on('connection', function(socket) {
    socket.on('joinroom', function(data) {
        var status = games[data.roomId].joinRoom(socket,data.name);
        if(status == -1) {
          socket.emit('joinroom',status);
        }
        else if(status[0] == status[1]) {
          var gameState = games[data.roomId].getState();
          io.to(data.roomId).emit('startgame',gameState);
        } else {
          io.to(data.roomId).emit('joinroom',status);
        }
        
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
  return io;
}

function joinGame(gameId) {
  if(games[gameId]) {
    return true;
  } else {
    return false;
  }
}

function addGame(game) {
  games[game.room] = game;
  console.log(games);
}

function getRoomIds() {
  //need to only get available rooms and pass more info
  return Object.keys(games);
}

module.exports = { start, addGame, joinGame, getRoomIds };