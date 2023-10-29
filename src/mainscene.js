import PF from "pathfinding";
import Player from "./Player";
import Enemy from "./Enemy";
import UiScene from "./UiScene";
import TurnManager from "./TurnManager";
import Entity from "./Entity";

export default class MainScene extends Phaser.Scene {
  constructor() {
    super("mainScene");
    this.gridSize = 16;

    /**
     * @type {Entity[]}
     */
    this.obstacles = [];

    /**
     * @type {Entity[]}
     */
    this.staticObstacles = [];
  }

  create() {
    this.turnManager = new TurnManager(this);

    /**
     * @type {Enemy[]}
     */
    this.enemies = [];

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

    this.spawnEnemies(this.tilemap);
    this.spawnBounds(this.tilemap);

    this.cameras.main.setZoom(2);
    this.cameras.main.startFollow(this.player.centerObject, true, 1, 1, 0, -60);

    this.scene.launch("uiScene", {
      currentHealth: this.player.health,
      maxHealth: this.player.maxHealth,
    });

    this.pfGrid = new PF.Grid(30, 20);
    this.setWalkableCells();
    // this.drawPathfindingGrid();
    this.pfFinder = new PF.AStarFinder();

    /**
     * @type {UiScene}
     */
    this.uiScene = this.scene.get("uiScene");

    this.input.on("pointerdown", () => {
      this.events.emit("playerAttack");
    });
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
      const rect = new Phaser.Geom.Rectangle(
        obj.x,
        obj.y,
        obj.width,
        obj.height
      );
      const wall = new Entity(rect);
      this.staticObstacles.push(wall);
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

        const isWalkable = this.checkObstacle(
          pixelX,
          pixelY,
          this.staticObstacles
        )
          ? false
          : true;
        this.pfGrid.setWalkableAt(i, j, isWalkable);
      }
    }
  }

  /**
   * Loops over the specified array, and checks if there is at least one game object at the specified position.
   *
   * While this function is used to set up pathfinding walkables, it should not be used instead of walkables for navigation. When used in isolation, it's only used for temporary blockages, like enemies that are going to move next turn. Use the walkables feature when dealing with static objects, or objects that rarely move.
   * @param {number} posX The X position to check.
   * @param {number} posY The Y position to check.
   * @param {Entity[]} entities The array to loop over.
   * @returns The entity that was found, or null if no entity was found.
   */
  checkObstacle(posX, posY, entities) {
    for (const entity of entities) {
      const Rectangle = Phaser.Geom.Rectangle;

      if (!entity || !entity.rect) return null;

      if (Rectangle.Contains(entity.rect, posX, posY)) {
        return entity;
      }
    }

    return null;
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
