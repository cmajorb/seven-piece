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
    socket.on('player connect', function(data) {
        console.log("Connected");
    });

    socket.on('move', function(data) {
      if(moveCharacter(socket,data)) {
        io.to(data.room).emit('update',games[data.room].getState());
      } else {
        socket.emit('error-msg','illegal');
      }
      console.log("Connected");
    });

  });
  return io;
}

function moveCharacter(socket,data) {
  return games[data.room].moveCharacter(socket,data.character,data.x,data.y);
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