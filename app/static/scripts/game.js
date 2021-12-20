var socket = io();
var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");
var width = canvas.getAttribute('width');
var height = canvas.getAttribute('height');
let sessionId = sessionStorage.getItem('data');
var highlightColor = "#FFC0CB80";
var tileSize;
var offSet = (width-height)/2;
var state;
var selectedCharacter = null;
const EMPTY = 1
const NORMAL = 2
const WALL = 4
const OBJECTIVE = 8
const PLAYER = 16

const roomId = window.location.pathname.split('/')[2];
canvas.addEventListener("click", clickEvent);

window.onload = function() {
  var name = window.prompt("Enter your name: ");
  socket.emit('joinroom', {"roomId" : roomId, "name" : name});
  
};



socket.on('startgame', function(gameState) {
    console.log("starting");
    console.log(gameState);
    state = gameState;
    redraw(gameState);
    var audio = new Audio("Loading Screen.mp3")
      audio.play();
  });
  socket.on('joinroom', function(status) {
    if(status == -1) {
      console.log("Room is full");
    } else {
      console.log(status[0] + "/" + status[1] + " players have joined");
    }
  });

  socket.on('update', function(gameState) {
    console.log("updating");
    state = gameState;
    redraw(gameState);
  });

  socket.on('error-msg', function(message) {
    console.log(message);
  });

  socket.on("set-session-acknowledgement", function(data) {
    sessionId = data;
    sessionStorage.setItem('data', data);
  });

function renderMap(map) {
    ctx.clearRect(0, 0, width, height);
    tileSize = height/map.data.length;
    for(var x = 0; x < map.data.length; x++) {
        for(var y = 0; y < map.data[0].length; y++) {
            var tile = map.data[x][y] & ~PLAYER;
            ctx.fillStyle = map.colors[tile.toString()];
            ctx.fillRect(tileSize * x + offSet, tileSize * y, tileSize, tileSize);
        }
    }
}

function createImage(character){
  var image = new Image();
  image.src = character.image;
  image.onload = function(){
    ctx.drawImage(image, (tileSize * character.location[0]) + offSet, tileSize * character.location[1], tileSize, tileSize);
  } 
}

function redraw(gameState) {
  renderMap(gameState.map);
  renderCharacters(gameState.characters);
}

function renderCharacters(characters) {
  for(var i = 0; i < characters.length; i++) {
    createImage(characters[i]);
  }
}

function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left - offSet,
    y: evt.clientY - rect.top
  };
}

function highlight(character) {
  ctx.fillStyle = highlightColor;
  var moves = getMoves(character);
  for(var i=0; i < moves.length; i++) {
    ctx.fillRect(tileSize * moves[i][0] + offSet, tileSize * moves[i][1], tileSize, tileSize);
  }
  renderCharacters(state.characters);
}

function getMoves(character) {
  var moves = [];
  var directions = [[],[],[],[],[],[],[],[]];
  if(!character.hasMoved) {
    for(var i=1; i<=character.moveRange; i++) {
      var x = character.location[0];
      var y = character.location[1];
      directions[0].push([x,y + i]);
      directions[1].push([x + i,y + i]);
      directions[2].push([x + i,y]);
      directions[3].push([x + i,y - i]);
      directions[4].push([x,y - i]);
      directions[5].push([x - i,y - i]);
      directions[6].push([x - i,y]);
      directions[7].push([x - i,y + i]);
      for(var j = 0; j < directions.length; j++) {
        for(var k =0; k < directions[j].length; k++) {
          var tx = directions[j][k][0];
          var ty = directions[j][k][1];
          if(tx >= 0 && ty >= 0 && tx < state.map.data[0].length && ty < state.map.data.length && (state.map.data[tx][ty] & ~(NORMAL | OBJECTIVE)) == 0) {
              moves.push([tx,ty]);
          } else {
              break;
          }
        }
      }
    }
  }
  return moves;
}

function makeMove(character,x,y) {
  socket.emit('move', {"character" : character.id, "x" : x, "y": y, "room" : roomId});
  selectedCharacter = null;
}
function select(x,y) {
  if(selectedCharacter) {
    if(getMoves(selectedCharacter).filter(loc => (loc[0] == x && loc[1]==y)).length > 0) {
      makeMove(selectedCharacter,x,y);
    } else {
      selectedCharacter = null;
      redraw(state);
      select(x,y);
    }
  } else {
    for(var i = 0; i < state.characters.length; i++) {
      if(state.characters[i].location[0] == x && state.characters[i].location[1] == y) {
        selectedCharacter = state.characters[i];
        highlight(state.characters[i]);
        return 
      }
    }
  }
  return -1;
}

function clickEvent(e) {
  var coor = getMousePos(canvas,e);
  var cursorY = Math.floor(coor.y/tileSize);
  var cursorX = Math.floor(coor.x/tileSize);
  select(cursorX,cursorY);
}