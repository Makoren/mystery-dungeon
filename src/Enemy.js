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
    // TODO: These are producing floats, when they should be integers for the cell positions.
    const cellX = this.sprite.x / this.scene.gridSize;
    const cellY = this.sprite.y / this.scene.gridSize;
    const playerCellX = player.sprite.x / this.scene.gridSize;
    const playerCellY = player.sprite.y / this.scene.gridSize;

    //const path = finder.findPath(cellX, cellY, playerCellX, playerCellY, grid);
    //console.log(path);
  }
}
