const Character = require('./character.js')

class Berserker extends Character {
    constructor(location, socketId) {
        super(location, socketId);
        this.health = 2;
        this.moveRange = 1;
        this.attackRange = 1;
        this.attackStrength = 2;
        this.name = "Berserker";
        this.image = "/images/berserker.png";
      }
    
    }

    module.exports = Berserker;