const crypto = require("crypto");
const Player = require("./player.js");
class GameState{
    constructor(map, size) {
        this.turnCount = 0;
        this.characters = [];
        this.room = crypto.randomBytes(16).toString("hex");
        this.map = map;
        this.players = [];
        this.state = "waiting";
        this.size = size;
      }
  
      advance = function() {
          this.turnCount++;
      };
      joinRoom = function(socket,name) {
        if(this.players.length < this.size) {
          socket.join(this.room);
          var player = new Player(name,socket);
          this.players.push(player)
          return [this.players.length,this.size];
        } else {
          return -1;
        }
      };
      getState = function() {
        var data = {
            "map" : this.map,
            "state" : this.state,
            //"players" : this.players,
            "turnCount" : this.turnCount
        };
        return data;
      };
    }

    module.exports = GameState;