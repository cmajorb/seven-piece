const crypto = require("crypto");

class Character {
   constructor(location, socketId) {
        this.hasMoved = false;
        this.location = location;
        this.id = crypto.randomBytes(16).toString("hex");
        this.frozen = false;
        this.socketId = socketId;
     }
   
   attack = function() {
      if(!this.frozen) {
       console.log('Character is attacking');
       return true;
      } else {
        return false;
      }
     };

    move = function(location) {
        if(!this.frozen && !this.hasMoved) {
          this.location = location;
          this.hasMoved = true;
          return true;
        } else {
          return false;
        } 
    };

    reset = function() {
      this.hasMoved = false;
      this.frozen = false;
    }
   
   }

   module.exports = Character;