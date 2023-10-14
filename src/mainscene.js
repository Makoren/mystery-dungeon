export default class MainScene extends Phaser.Scene {
  constructor() {
    super("mainScene");
  }

  preload() {
    this.load.image("tilesetInterior", "tilemaps/TilesetInterior.png");
    this.load.image(
      "tilesetInteriorFloor",
      "tilemaps/TilesetInteriorFloor.png"
    );
    this.load.tilemapTiledJSON("tilemap", "tilemaps/main.tmj");
  }

  create() {
    const map = this.make.tilemap({ key: "tilemap" });
    const tilesetInteriorFloor = map.addTilesetImage(
      "TilesetInteriorFloor",
      "tilesetInteriorFloor"
    );
    const tilesetInterior = map.addTilesetImage(
      "TilesetInterior",
      "tilesetInterior"
    );
    const floorLayer = map.createLayer("floor", tilesetInteriorFloor);
    const wallsLayer = map.createLayer("walls", tilesetInterior);
  }

  update() {}
}
