const crypto = require("crypto");
class Player{
    constructor(name) {
        this.name = name;
        this.socketId = '';
        this.sessionId = crypto.randomBytes(16).toString("hex");
        this.ip = '';
        this.state = "waiting";
      }
  
      connect = function(socket) {
          this.socketID = socket.id;
          this.ip = socket.handshake.address;
      };
    }

    module.exports = Player;