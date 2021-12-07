const crypto = require("crypto");
class Player{
    constructor(name,socket) {
        this.name = name;
        this.socket = socket;
        this.sessionId = socket.id;
        this.ip = socket.handshake.address;
        this.state = "joined";
      }
    }

    module.exports = Player;