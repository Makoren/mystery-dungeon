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
    this.attackTarget = undefined;
    this.nextPosX = 0;
    this.nextPosY = 0;

    this.sprite = scene.add.sprite(x, y);
    this.sprite.setDepth(depth);
    this.sprite.play("enemyWalkDown");
    this.tag = "enemy";

    this.targetCell = new Entity(this.sprite.getBounds());
    this.targetCell.parent = this;
    this.targetCellIndex = scene.obstacles.push(this.targetCell) - 1;

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

      this.setFacing(
        this.sprite.x,
        this.sprite.y,
        this.nextPosX,
        this.nextPosY
      );

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
          this.attackTarget = entity;
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
   * Set `facing` to a value based on the direction from a point to another point.
   * @param {number} startX The starting X position.
   * @param {number} startY The starting Y position.
   * @param {number} endX The ending X position.
   * @param {number} endY The ending Y position.
   */
  setFacing(startX, startY, endX, endY) {
    if (startX > endX) {
      this.facing = FACING_LEFT;
    } else if (startX < endX) {
      this.facing = FACING_RIGHT;
    } else if (startY > endY) {
      this.facing = FACING_UP;
    } else if (startY < endY) {
      this.facing = FACING_DOWN;
    } else {
      console.error("Invalid positions");
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
          onComplete: () => this.attackEntity(this.attackTarget),
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

  attackEntity(entity) {
    if (entity !== undefined && entity.parent.tag === "player") {
      entity.parent.damage(1, () => entity.parent.destroy());
    }
  }

  /**
   * Destroy each component of the enemy, making it inactive.
   */
  destroy() {
    this.scene.turnManager.remove(this);
    this.scene.obstacles.splice(this.targetCellIndex, 1);
    this.sprite.destroy();
    this.centerObject.destroy();
    this.targetCell.rect = undefined;
    this.targetCell.parent = undefined;
    this.targetCell = undefined;
  }
}
