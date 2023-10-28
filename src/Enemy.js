import Entity from "./Entity";
import MainScene from "./MainScene";
import Position from "./Position";

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

    this.queueState = -1; // can be 0 or 1 to represent moving or attacking
    this.nextPosX = 0;
    this.nextPosY = 0;

    this.sprite = scene.add.sprite(x, y);
    this.sprite.setDepth(depth);
    this.sprite.play("enemyWalkDown");
    this.tag = "enemy";

    this.targetCell = new Entity(this.sprite.getBounds());
    this.targetCell.parent = this;
    scene.obstacles.push(this.targetCell);

    this.centerObject = new Position(scene, this.sprite.x, this.sprite.y);
  }

  processTurn() {
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

      this.nextPosX =
        nextNode[0] * this.scene.gridSize + this.scene.gridSize / 2;
      this.nextPosY =
        nextNode[1] * this.scene.gridSize + this.scene.gridSize / 2;

      // check if there's another enemy in the way, otherwise keep going
      const entity = this.scene.checkObstacle(
        this.nextPosX,
        this.nextPosY,
        this.scene.obstacles
      );
      if (entity === null) {
        // subtract half of gridSize to account for origin point
        this.targetCell.rect.x = this.nextPosX - this.scene.gridSize / 2;
        this.targetCell.rect.y = this.nextPosY - this.scene.gridSize / 2;

        this.queueState = 0; // moving
      } else {
        if (!entity.parent) console.error("This entity has no parent");

        if (entity.parent.tag === "player") {
          this.queueState = 1; // attacking
        } else {
          this.queueState = -1; // do nothing
        }
      }
    } else {
      this.queueState = -1; // do nothing
      console.log("no path found");
    }

    return this.queueState;
  }

  startTurn() {
    if (this.queueState === 1) {
      this.attack();
    } else if (this.queueState === 0) {
      this.move();
    } else if (this.queueState === -1) {
      // do nothing
    } else {
      console.error("Invalid queueState");
    }
  }

  /**
   * Find a path to the player, and then move one cell.
   */
  move() {
    const tweenDuration = 250;
    this.scene.add.tween({
      targets: [this.sprite, this.centerObject],
      x: this.nextPosX,
      y: this.nextPosY,
      duration: tweenDuration,
    });

    this.scene.events.emit("nextTurn");
  }

  // FIXME: Identical to the player's attack function, maybe should be added to Entity instead with different args.
  attack() {
    let moveX = 0;
    let moveY = 0;
    const speed = 8;

    switch (this.facing) {
      case FACING_DOWN:
        moveY = speed;
        break;
      case FACING_UP:
        moveY = -speed;
        break;
      case FACING_LEFT:
        moveX = -speed;
        break;
      case FACING_RIGHT:
        moveX = speed;
        break;
      default:
        break;
    }

    this.scene.tweens.chain({
      targets: this.sprite,
      tweens: [
        {
          x: this.sprite.x - moveX,
          y: this.sprite.y - moveY,
          duration: 200,
          ease: "linear",
        },
        {
          x: this.sprite.x + moveX,
          y: this.sprite.y + moveY,
          duration: 100,
          ease: "linear",
        },
        {
          x: this.centerObject.x,
          y: this.centerObject.y,
          duration: 400,
          ease: "linear",
        },
      ],
      onComplete: () => {
        this.isAttacking = false;
        this.scene.events.emit("nextTurn");
      },
    });
  }
}
