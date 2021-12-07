var socket = io();
var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");
var width = canvas.getAttribute('width');
var height = canvas.getAttribute('height');
let sessionId = sessionStorage.getItem('data');
var colors = ["brown","black","yellow"];

const roomId = window.location.pathname.split('/')[2];

window.onload = function() {
  var name = window.prompt("Enter your name: ");
  socket.emit('joinroom', {"roomId" : roomId, "name" : name});
};



socket.on('startgame', function(gameState) {
    console.log("starting");
    console.log(gameState);

    renderMap(gameState.map);
  });
  socket.on('joinroom', function(status) {
    if(status == -1) {
      console.log("Room is full");
    } else {
      console.log(status[0] + "/" + status[1] + " players have joined");
    }
  });
  
  socket.on("set-session-acknowledgement", function(data) {
    sessionId = data;
    sessionStorage.setItem('data', data);
  });

function renderMap(map) {
    ctx.clearRect(0, 0, width, height);
    var tileSize = height/map.data.length;
    var offSet = (width-height)/2;
    for(var x = 0; x < map.data.length; x++) {
        for(var y = 0; y < map.data[0].length; y++) {
            ctx.fillStyle = colors[map.data[x][y]];
            ctx.fillRect(tileSize * x + offSet, tileSize * y, tileSize, tileSize);
        }
    }
}