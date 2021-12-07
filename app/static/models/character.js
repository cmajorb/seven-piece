const crypto = require("crypto");

class Character {
   constructor(health,range,attack) {
        this.health = health;
        this.range = range;
        this.attack = attack;
        this.location = [1,0];
        this.id = crypto.randomBytes(16).toString("hex");
     }
   
   attack = function() {
       console.log('Character is attacking');
     };
   
   }

   module.exports = Character;