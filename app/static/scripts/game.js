var socket = io();
var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");
var width = canvas.getAttribute('width');
var height = canvas.getAttribute('height');
let sessionId = sessionStorage.getItem('data');
var colors = ["brown","black","yellow","pink"];
var tileSize;
var offSet = (width-height)/2;
var state;
var selectedCharacter = null;

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
            ctx.fillStyle = colors[map.data[x][y]];
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
  ctx.fillStyle = colors[3];
  var moves = getMoves(character);
  for(var i=0; i < moves.length; i++) {
    ctx.fillRect(tileSize * moves[i][0] + offSet, tileSize * moves[i][1], tileSize, tileSize);
  }
  renderCharacters(state.characters);
}

function getMoves(character) {
  //TODO: include objectives as valid moves
  var moves = [];
  for(var i=1; i<=character.range; i++) {
    for(var x = character.location[0] - 1; x <= character.location[0] + 1; x++) {
      if(x >= 0 && x < state.map.data[0].length) {
        for(var y = character.location[1] - 1; y <= character.location[1] + 1; y++) {
          if(y >= 0 && y < state.map.data.length) {
            if(state.map.data[x][y] == 0 && !(character.location[0] == x && character.location[1] == y)) {
              moves.push([x,y]);
            }
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