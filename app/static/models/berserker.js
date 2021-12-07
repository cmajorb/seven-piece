const Character = require('./character.js')

class Berserker extends Character {
    constructor() {
        super(1,1,3);
        this.name = "berserker";
        this.image = "/images/wizard.png";
      }
    
    attack = function() {
        console.log('Berserker is attacking');
    };
    
    }

    module.exports = Berserker;