import Player from "./Player";
import Enemy from "./Enemy";
import UiScene from "./UiScene";

export default class MainScene extends Phaser.Scene {
  constructor() {
    super("mainScene");
    this.gridSize = 16;
  }

  create() {
    this.player = new Player(
      this,
      this.gridSize * 5 + this.gridSize / 2,
      this.gridSize * 3 + this.gridSize / 2,
      10
    );
    this.enemies = [];
    this.tilemap = this.createTilemap();

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

    const entities = map.getObjectLayer("entities");
    entities.objects.forEach((obj) => {
      if (obj.name === "enemy") {
        this.enemies.push(
          new Enemy(
            this,
            obj.x + this.gridSize / 2,
            obj.y + this.gridSize / 2,
            5
          )
        );
      }
    });

    return map;
  }
}
