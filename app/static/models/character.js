const crypto = require("crypto");

class Character {
   constructor(health,moveRange,attackRange,attack,location) {
        this.health = health;
        this.moveRange = moveRange;
        this.attackRange = attackRange;
        this.attack = attack;
        this.location = location;
        this.id = crypto.randomBytes(16).toString("hex");
     }
   
   attack = function() {
       console.log('Character is attacking');
     };
   
   }

   module.exports = Character;