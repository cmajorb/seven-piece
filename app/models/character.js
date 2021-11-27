class Character {
   constructor(health,range,attack) {
        this.health = health;
        this.range = range;
        this.attack = attack;
     }
   
   attack = function() {
       console.log('Character is attacking');
     };
   
   }

   module.exports = Character;