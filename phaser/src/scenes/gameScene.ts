import "phaser";
export class GameScene extends Phaser.Scene {
  mainBackground: Phaser.Physics.Arcade.StaticGroup;
  info: Phaser.GameObjects.Text;
  example_map: number[][];
  constructor() {
    super({
      key: "GameScene"
    });
  }
  init(params): void {
    // initialize variables
    this.example_map = [
      [9, 9, 1, 1, 1, 1, 1, 9, 9],
      [9, 9, 1, 1, 0, 1, 1, 9, 9],
      [9, 9, 9, 1, 1, 1, 9, 9, 9],
      [9, 9, 9, 9, 1, 9, 9, 9, 9],
      [1, 1, 1, 1, 6, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1],
      [0, 1, 0, 1, 0, 1, 0, 1, 0],
      [6, 1, 0, 1, 6, 1, 0, 1, 6],
      [0, 1, 0, 1, 0, 1, 0, 1, 0],
      [1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 6, 1, 1, 1, 1],
      [9, 9, 9, 9, 1, 9, 9, 9, 9],
      [9, 9, 9, 1, 1, 1, 9, 9, 9],
      [9, 9, 1, 1, 0, 1, 1, 9, 9],
      [9, 9, 1, 1, 1, 1, 1, 9, 9]
    ];
  }
  preload(): void {
    this.load.image('mainBackground', 'https://d36mxiodymuqjm.cloudfront.net/website/battle/backgrounds/bg_stone-floor.png');
    this.load.image('soldier', 'https://d36mxiodymuqjm.cloudfront.net/card_art/Legionnaire%20Alvar.png');
    this.load.image('tileset', './newtileset.png');

  }

  select_tile(tile): void {
    if (tile.index == 1) {
      tile.index = 2
    } else if (tile.index == 6) {
      tile.index = 3
    }
  }

  create(): void {
    this.mainBackground = this.physics.add.staticGroup({
      key: 'mainBackground',
      frameQuantity: 20
    });
    this.mainBackground.setXY(200, 300)
    this.mainBackground.refresh();

    var soldier = this.physics.add.sprite(200, 300, 'soldier');
    soldier.setDisplaySize(75, 75)

    const map = this.make.tilemap({ data: this.example_map, tileWidth: 200, tileHeight: 200 });
    const tiles = map.addTilesetImage("tileset");
    const layer = map.createLayer(0, tiles, 0, 0);
    var scale_factor = this.sys.game.canvas.height / (this.example_map.length * 200)
    layer.setScale(scale_factor)

    //   this.input.on('pointerdown', function () {
    //     this.cameras.main.shake(500);
    // }, this);

    this.input.on('pointerup', function (pointer) {
      var tile = map.getTileAtWorldXY(pointer.worldX, pointer.worldY);
      this.select_tile(tile);
    }, this);

  }

  update(time): void {
    // TODO
  }
};
