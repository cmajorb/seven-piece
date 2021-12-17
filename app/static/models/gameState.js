const crypto = require("crypto");
const Berserker = require("./berserker.js");
const Player = require("./player.js");
const EMPTY = 1
const NORMAL = 2
const WALL = 4
const OBJECTIVE = 8
const PLAYER = 16

class GameState{
    constructor(map, size) {
        this.turnCount = 0;
        this.characters = [];
        this.characters.push(new Berserker([0,1]));
        this.characters.push(new Berserker([2,4]));
        this.room = crypto.randomBytes(16).toString("hex");
        this.map = map;
        this.players = [];
        this.state = "waiting";
        this.size = size;
      }
  
      advance = function() {
          this.turnCount++;
      };
      moveCharacter = function(socket,charId,x,y) {
        if(this.players[this.turnCount%this.size].socket == socket) {
          //TODO: check to see if valid move and if owner
          var char = this.characters.filter(c => (c.id == charId))
          var curLoc = char[0].location;
          //add check right here
          if(char[0].move([x,y])) {
            this.map.data[x][y] |= PLAYER;
            this.map.data[curLoc[0]][curLoc[1]] &= ~PLAYER;
            return true;
          }
          
        }
        return false;
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
            "turnCount" : this.turnCount,
            "characters" : this.characters
        };
        return data;
      };
    }

    module.exports = GameState;