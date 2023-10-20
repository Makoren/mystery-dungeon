import PF from "pathfinding";
import Player from "./Player";
import Enemy from "./Enemy";
import UiScene from "./UiScene";
import TurnManager from "./TurnManager";

export default class MainScene extends Phaser.Scene {
  constructor() {
    super("mainScene");
    this.gridSize = 16;

    /**
     * @type {Phaser.GameObjects.GameObject[]}
     */
    this.obstacles = [];
  }

  create() {
    this.turnManager = new TurnManager(this);

    /**
     * @type {Enemy[]}
     */
    this.enemies = [];

    this.turnManager.add(this.player);

    this.tilemap = this.createTilemap("tilemap");

    this.tilemap.findObject("entities", (obj) => {
      if (obj.name === "player") {
        this.player = new Player(
          this,
          obj.x + this.gridSize / 2,
          obj.y + this.gridSize / 2,
          10
        );
      }
    });

    this.cameras.main.setZoom(2);
    this.cameras.main.startFollow(this.player.sprite, true, 1, 1, 0, -60);

    this.scene.launch("uiScene");

    this.pfGrid = new PF.Grid(30, 20);
    this.setWalkableCells();
    //this.drawPathfindingGrid();
    this.pfFinder = new PF.AStarFinder();

    for (const enemy of this.enemies) {
      enemy.move();
    }

    /**
     * @type {UiScene}
     */
    this.uiScene = this.scene.get("uiScene");

    this.turnManager.startNextTurn();
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
    this.spawnBounds(map);

    return map;
  }

  /**
   * @private
   * Used to spawn enemies when the tilemap is created.
   * @param {Phaser.Tilemaps.Tilemap} map The map to load entities from.
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
        this.turnManager.add(enemy);
        this.enemies.push(enemy);
      }
    });
  }

  /**
   * @private
   * Loads the walls around the map from the `bounds` object layer.
   * @param {Phaser.Tilemaps.Tilemap} map The map to load bounds from.
   */
  spawnBounds(map) {
    const bounds = map.getObjectLayer("bounds");
    for (const obj of bounds.objects) {
      const b = this.add.zone(obj.x, obj.y, obj.width, obj.height);
      b.setOrigin(0, 0);
      this.obstacles.push(b);
    }
  }

  /**
   * Iterates over the Pathfinding.js grid cells and sets them to be walkable or not walkable, judging by whether or not an obstacle is present at that cell's location.
   */
  setWalkableCells() {
    for (let i = 0; i < this.pfGrid.width; i++) {
      for (let j = 0; j < this.pfGrid.height; j++) {
        const pixelX = i * this.gridSize + this.gridSize / 2;
        const pixelY = j * this.gridSize + this.gridSize / 2;

        let isBlocked = false;
        for (const obs of this.obstacles) {
          const Rectangle = Phaser.Geom.Rectangle;

          let bounds;
          if (obs.type === "Sprite") {
            bounds = new Rectangle(
              obs.x - this.gridSize / 2,
              obs.y - this.gridSize / 2,
              this.gridSize,
              this.gridSize
            );
          } else if (obs.type === "Zone") {
            bounds = new Rectangle(obs.x, obs.y, obs.width, obs.height);
          } else {
            console.error("Unknown obstacle type");
          }

          if (Phaser.Geom.Rectangle.Contains(bounds, pixelX, pixelY)) {
            isBlocked = true;
            break;
          }
        }

        this.pfGrid.setWalkableAt(i, j, isBlocked);

        // TODO: You may need to call this every time the player's turn starts.
      }
    }
  }

  /**
   * @private
   * Draws a grid of rectangles to represent walkable locations on the grid. Used for debugging.
   */
  drawPathfindingGrid() {
    // loop over every cell in pfGrid
    // draw a transparent rectangle, green is walkable, red is blocked
    for (let i = 0; i < this.pfGrid.width; i++) {
      for (let j = 0; j < this.pfGrid.height; j++) {
        const rect = this.add.rectangle(
          i * this.gridSize,
          j * this.gridSize,
          this.gridSize,
          this.gridSize,
          this.pfGrid.getNodeAt(i, j).walkable ? 0x00ff00 : 0xff0000
        );
        rect.setAlpha(0.5);
        rect.setOrigin(0, 0);
      }
    }
  }
}
