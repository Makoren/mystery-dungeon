import MainScene from "./MainScene";

const FACING_DOWN = 0;
const FACING_UP = 1;
const FACING_LEFT = 2;
const FACING_RIGHT = 3;

/**
 * Used to represent enemies in the scene.
 */
export default class Enemy {
  /**
   * @param {MainScene} scene The current scene.
   * @param {number} x The initial X position.
   * @param {number} y The initial Y position.
   * @param {number} depth Used for setDepth on the created sprite.
   */
  constructor(scene, x, y, depth) {
    this.scene = scene;
    this.facing = FACING_DOWN;
    this.isMoving = false;

    this.sprite = scene.add.sprite(x, y);
    this.sprite.setDepth(depth);
    this.sprite.play("enemyWalkDown");
    scene.obstacles.push(this.sprite);
  }

  move() {
    // find path towards player's cell
    // move one cell towards the player

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
      const tweenDuration = 250;
      this.scene.add.tween({
        targets: this.sprite,
        x: nextNode[0] * this.scene.gridSize + this.scene.gridSize / 2,
        y: nextNode[1] * this.scene.gridSize + this.scene.gridSize / 2,
        duration: tweenDuration,
        onComplete: () => (this.isMoving = false),
      });
    }
  }
}
