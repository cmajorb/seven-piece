var socket = io();
var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");
var width = canvas.getAttribute('width');
var height = canvas.getAttribute('height');
let sessionId = sessionStorage.getItem('data');
var map;
var colors = ["brown","black","yellow"];


socket.emit('start-session', sessionId);

socket.on('init', function(gameMap) {
    map = gameMap;
    console.log("init run");
    renderMap();
  });

  socket.on("set-session-acknowledgement", function(data) {
    sessionId = data;
    sessionStorage.setItem('data', data);
  });

function renderMap() {
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