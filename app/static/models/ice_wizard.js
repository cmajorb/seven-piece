const Character = require('./character.js')

class IceWizard extends Character {
    constructor(location, socketId) {
        super(location, socketId);
        this.health = 1;
        this.moveRange = 1;
        this.attackRange = 0;
        this.attackStrength = 0;
        this.name = "Ice Wizard";
        this.image = "/images/ice_wizard.png";
      }
    
    }

    module.exports = IceWizard;