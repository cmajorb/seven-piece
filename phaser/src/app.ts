import "phaser";
import { GameScene } from "./scenes/gameScene";
const config: Phaser.Types.Core.GameConfig = {
  title: "Seven Piece",
  parent: "game",
  scale: {
    mode: Phaser.Scale.FIT,
    parent: 'phaser-example',
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 800,
    height: 600
},
  scene: [GameScene],
  physics: {
    default: "arcade",
    arcade: {
      debug: false
    }
  },
  backgroundColor: "#000033"
};

 export class SevenPieceGame extends Phaser.Game {
      constructor(config: Phaser.Types.Core.GameConfig) {
        super(config);
      }
    }
    window.onload = () => {
      var game = new SevenPieceGame(config);
    };