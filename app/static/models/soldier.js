const Character = require('./character.js')

class Soldier extends Character {
    constructor(location, socketId) {
        super(location, socketId);
        this.health = 3;
        this.moveRange = 1;
        this.attackRange = 1;
        this.attackStrength = 1;
        this.name = "Soldier";
        this.image = "/images/soldier.png";
      }
    
    }

    module.exports = Soldier;