const crypto = require("crypto");
class GameState{
    constructor(map, player, size) {
        this.turnCount = 0;
        this.characters = [];
        this.room = crypto.randomBytes(16).toString("hex");
        this.map = map;
        this.players = [];
        this.players.push(player);
        this.state = "waiting";
        this.size = size;
      }
  
      advance = function() {
          this.turnCount++;
      };
      joinRoom = function(player) {
        this.players.push(player);
        if(players.size == size) {
          this.state = "starting";
        }
      };
    }

    module.exports = GameState;