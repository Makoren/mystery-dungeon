import Entity from "./Entity";
import MainScene from "./MainScene";

const FACING_DOWN = 0;
const FACING_UP = 1;
const FACING_LEFT = 2;
const FACING_RIGHT = 3;

/**
 * Used to represent enemies in the scene.
 */
export default class Enemy extends Entity {
  /**
   * @param {MainScene} scene The current scene.
   * @param {number} x The initial X position.
   * @param {number} y The initial Y position.
   * @param {number} depth Used for setDepth on the created sprite.
   * @param {Phaser.Geom.Rectangle} rect The rectangle used for obstacle checking.
   */
  constructor(scene, x, y, depth) {
    const rect = new Phaser.Geom.Rectangle(0, 0, 16, 16);
    super(rect);

    this.scene = scene;
    this.facing = FACING_DOWN;
    this.isMoving = false;

    this.sprite = scene.add.sprite(x, y);
    this.sprite.setDepth(depth);
    this.sprite.play("enemyWalkDown");

    this.targetCell = new Entity(this.sprite.getBounds());
    scene.obstacles.push(this.targetCell);
  }

  startTurn() {
    this.move();
    this.scene.events.emit("nextTurn");
  }

  /**
   * Find a path to the player, and then move one cell.
   */
  move() {
    // clone the grid since it's mutated on findPath
    const grid = this.scene.pfGrid.clone();
    const finder = this.scene.pfFinder;
    const player = this.scene.player;

    // get cell positions from pixel positions
    const cellX = Math.floor(this.sprite.x / this.scene.gridSize);
    const cellY = Math.floor(this.sprite.y / this.scene.gridSize);
    const playerCellX = Math.floor(player.sprite.x / this.scene.gridSize);
    const playerCellY = Math.floor(player.sprite.y / this.scene.gridSize);

    // find path and move to the next node (if it exists)
    const path = finder.findPath(cellX, cellY, playerCellX, playerCellY, grid);
    if (path.length > 1) {
      const nextNode = path[1];

      const nextPosX =
        nextNode[0] * this.scene.gridSize + this.scene.gridSize / 2;
      const nextPosY =
        nextNode[1] * this.scene.gridSize + this.scene.gridSize / 2;

      // check if there's another enemy in the way, otherwise keep going
      if (!this.scene.checkObstacle(nextPosX, nextPosY, this.scene.obstacles)) {
        // subtract half of gridSize to account for origin point
        this.targetCell.rect.x = nextPosX - this.scene.gridSize / 2;
        this.targetCell.rect.y = nextPosY - this.scene.gridSize / 2;

        const tweenDuration = 250;
        this.scene.add.tween({
          targets: this.sprite,
          x: nextPosX,
          y: nextPosY,
          duration: tweenDuration,
          onComplete: () => (this.isMoving = false),
        });
      }

      console.log("Enemy:");
      console.log(this.targetCell.rect);
    }
  }
}
