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
    this.tilemap = this.createTilemap("tilemap");

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

  /**
   * Creates a tilemap from the preloaded Tiled map and returns it.
   * @param {string} tilemapKey The key for the preloaded Tiled map.
   * @returns The created tilemap.
   */
  createTilemap(tilemapKey) {
    const map = this.make.tilemap({ key: tilemapKey });

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

    this.spawnEnemies(map);

    return map;
  }

  /**
   * @private
   * Used to spawn enemies when the tilemap is created.
   */
  spawnEnemies(map) {
    const entities = map.getObjectLayer("entities");
    entities.objects.forEach((obj) => {
      if (obj.name === "enemy") {
        const enemy = new Enemy(
          this,
          obj.x + this.gridSize / 2,
          obj.y + this.gridSize / 2,
          5
        );
        this.enemies.push(enemy);
      }
    });
  }
}
