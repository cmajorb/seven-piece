const Character = require('./character.js')

class Scout extends Character {
    constructor(location, socketId) {
        super(location, socketId);
        this.health = 2;
        this.moveRange = 3;
        this.attackRange = 1;
        this.attackStrength = 1;
        this.name = "Scout";
        this.image = "/images/scout.png";
      }
    
    }

    module.exports = Scout;