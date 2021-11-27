const Character = require('./character.js')

class Berserker extends Character {
    constructor() {
        super(1,1,3);
        this.name = "berserker";
      }
    
    attack = function() {
        console.log('Berserker is attacking');
    };
    
    }

    module.exports = Berserker;