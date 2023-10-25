import Entity from "./Entity";
import MainScene from "./MainScene";

const FACING_DOWN = 0;
const FACING_UP = 1;
const FACING_LEFT = 2;
const FACING_RIGHT = 3;

/**
 * The player character, controlled by input methods.
 */
export default class Player extends Entity {
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
    this.isTurnActive = false;

    this.sprite = scene.add.sprite(x, y);
    this.sprite.setDepth(depth);

    const targetCellRect = new Phaser.Geom.Rectangle(
      this.sprite.x - this.scene.gridSize / 2,
      this.sprite.y - this.scene.gridSize / 2,
      16,
      16
    );
    this.targetCell = new Entity(targetCellRect);
    scene.obstacles.push(this.targetCell);
  }

  /**
   * Called externally by the turn manager to start this object's turn.
   */
  startTurn() {
    this.isTurnActive = true;
  }

  /**
   * Moves and animates the player.
   */
  update() {
    this.move();
    this.animate();
  }

  /**
   * @private
   * Attempt to move the player with the joystick axes after checking for obstacles. Called internally.
   */
  move() {
    const joystick = this.scene.uiScene.joystick;

    if (joystick && !this.isMoving && this.isTurnActive) {
      const xMove = joystick.getXAxis();
      const yMove = joystick.getYAxis();
      const angle = Math.atan2(yMove, xMove);
      const angleDegrees = angle * (180 / Math.PI);
      const length = Math.sqrt(xMove ** 2 + yMove ** 2);
      const threshold = 0.25;

      if (length > threshold) {
        if (!this.scene.gridSize) {
          console.error("No grid size defined on scene");
          return;
        }

        if (angleDegrees < 45 && angleDegrees >= -45) {
          this.facing = FACING_RIGHT;
        } else if (angleDegrees > -135 && angleDegrees <= -45) {
          this.facing = FACING_UP;
        } else if (angleDegrees < 135 && angleDegrees >= 45) {
          this.facing = FACING_DOWN;
        } else if (angleDegrees >= 135 || angleDegrees <= -135) {
          this.facing = FACING_LEFT;
        }

        if (!this.checkObstacle(this.facing)) {
          this.moveInDirection(this.facing);
        }
      }
    }

    this.sprite.x = Math.round(this.sprite.x);
    this.sprite.y = Math.round(this.sprite.y);
  }

  /**
   * Move the player in the direction specified.
   * @param {number} facing Facing constant used for direction.
   */
  moveInDirection(facing) {
    const tweenDuration = 250;

    let nextPosX;
    let nextPosY;

    switch (facing) {
      case FACING_DOWN:
        nextPosY = this.sprite.y + this.scene.gridSize;
        this.targetCell.rect.y = nextPosY - this.scene.gridSize / 2;

        this.scene.add.tween({
          targets: this.sprite,
          y: nextPosY,
          duration: tweenDuration,
          onComplete: () => (this.isMoving = false),
        });
        break;
      case FACING_UP:
        nextPosY = this.sprite.y - this.scene.gridSize;
        this.targetCell.rect.y = nextPosY - this.scene.gridSize / 2;

        this.scene.add.tween({
          targets: this.sprite,
          y: nextPosY,
          duration: tweenDuration,
          onComplete: () => (this.isMoving = false),
        });
        break;
      case FACING_LEFT:
        nextPosX = this.sprite.x - this.scene.gridSize;
        this.targetCell.rect.x = nextPosX - this.scene.gridSize / 2;

        this.scene.add.tween({
          targets: this.sprite,
          x: nextPosX,
          duration: tweenDuration,
          onComplete: () => (this.isMoving = false),
        });
        break;
      case FACING_RIGHT:
        nextPosX = this.sprite.x + this.scene.gridSize;
        this.targetCell.rect.x = nextPosX - this.scene.gridSize / 2;

        this.scene.add.tween({
          targets: this.sprite,
          x: nextPosX,
          duration: tweenDuration,
          onComplete: () => (this.isMoving = false),
        });
        break;
      default:
        break;
    }

    this.isMoving = true;
    this.isTurnActive = false;
    this.scene.events.emit("nextTurn");
  }

  /**
   * @private
   * Animate the player based on the direction it's facing.
   */
  animate() {
    if (this.isMoving) {
      switch (this.facing) {
        case FACING_DOWN:
          this.sprite.play("playerWalkDown", true);
          break;

        case FACING_UP:
          this.sprite.play("playerWalkUp", true);
          break;

        case FACING_LEFT:
          this.sprite.play("playerWalkLeft", true);
          break;

        case FACING_RIGHT:
          this.sprite.play("playerWalkRight", true);
          break;

        default:
          break;
      }
    } else {
      switch (this.facing) {
        case FACING_DOWN:
          this.sprite.play("playerIdleDown", true);
          break;

        case FACING_UP:
          this.sprite.play("playerIdleUp", true);
          break;

        case FACING_LEFT:
          this.sprite.play("playerIdleLeft", true);
          break;

        case FACING_RIGHT:
          this.sprite.play("playerIdleRight", true);
          break;

        default:
          break;
      }
    }
  }

  /**
   * Checks for an obstacle in front of the object using its bounds. This function iterates over the scene's `obstacles`. Not to be confused with the `MainScene` function of the same name.
   * @param {number} facing Facing constant to determine direction of check.
   * @returns Whether or not an obstacle was found.
   */
  checkObstacle(facing) {
    const Rectangle = Phaser.Geom.Rectangle;
    let hitObstacle = false;

    const entities = this.scene.obstacles.concat(this.scene.staticObstacles);

    for (const entity of entities) {
      switch (facing) {
        case FACING_DOWN:
          hitObstacle = Rectangle.Contains(
            entity.rect,
            this.sprite.x,
            this.sprite.y + this.scene.gridSize
          );
          break;
        case FACING_UP:
          hitObstacle = Rectangle.Contains(
            entity.rect,
            this.sprite.x,
            this.sprite.y - this.scene.gridSize
          );
          break;
        case FACING_LEFT:
          hitObstacle = Rectangle.Contains(
            entity.rect,
            this.sprite.x - this.scene.gridSize,
            this.sprite.y
          );
          break;
        case FACING_RIGHT:
          hitObstacle = Rectangle.Contains(
            entity.rect,
            this.sprite.x + this.scene.gridSize,
            this.sprite.y
          );
          break;
        default:
          break;
      }

      if (hitObstacle) break;
    }

    return hitObstacle;
  }
}
