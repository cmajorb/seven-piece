const Character = require('./character.js')

class Berserker extends Character {
    constructor(location) {
        super(1,1,1,3,location);
        this.name = "berserker";
        this.image = "/images/wizard.png";
      }
    
    attack = function() {
        console.log('Berserker is attacking');
    };
    
    }

    module.exports = Berserker;