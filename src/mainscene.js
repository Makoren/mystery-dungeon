import Player from "./Player";
import UiScene from "./UiScene";

export default class MainScene extends Phaser.Scene {
  constructor() {
    super("mainScene");
    this.gridSize = 16;
  }

  create() {
    this.tilemap = this.createTilemap();
    this.player = new Player(
      this,
      this.gridSize * 5 + this.gridSize / 2,
      this.gridSize * 3 + this.gridSize / 2
    );

    // FIXME: Set zoom based on screen size if needed.
    this.cameras.main.setZoom(2);
    this.cameras.main.startFollow(this.player.sprite, true, 1, 1, 0, -60);

    this.scene.launch("uiScene");

    /**
     * @type {UiScene}
     */
    this.uiScene = this.scene.get("uiScene");
  }

  update() {
    this.player.update();
  }

  createTilemap() {
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

    return map;
  }
}
