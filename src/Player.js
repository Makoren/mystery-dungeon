import MainScene from "./MainScene";

const FACING_DOWN = 0;
const FACING_UP = 1;
const FACING_LEFT = 2;
const FACING_RIGHT = 3;

/**
 * The player character, controlled by input methods.
 */
export default class Player {
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
    this.isTurnActive = false;

    this.sprite = scene.add.sprite(x, y);
    this.sprite.setDepth(depth);
    scene.obstacles.push(this.sprite);
  }

  /**
   * Called externally by the turn manager to start this object's turn.
   */
  startTurn() {
    this.isTurnActive = true;
    console.log("Player start!");
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

    if (joystick && !this.isMoving /*&& this.isTurnActive*/) {
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

    this.isMoving = true;
    this.isTurnActive = false;
    this.scene.events.emit("nextTurn");

    switch (facing) {
      case FACING_DOWN:
        this.scene.add.tween({
          targets: this.sprite,
          y: this.sprite.y + this.scene.gridSize,
          duration: tweenDuration,
          onComplete: () => (this.isMoving = false),
        });
        break;
      case FACING_UP:
        this.scene.add.tween({
          targets: this.sprite,
          y: this.sprite.y - this.scene.gridSize,
          duration: tweenDuration,
          onComplete: () => (this.isMoving = false),
        });
        break;
      case FACING_LEFT:
        this.scene.add.tween({
          targets: this.sprite,
          x: this.sprite.x - this.scene.gridSize,
          duration: tweenDuration,
          onComplete: () => (this.isMoving = false),
        });
        break;
      case FACING_RIGHT:
        this.scene.add.tween({
          targets: this.sprite,
          x: this.sprite.x + this.scene.gridSize,
          duration: tweenDuration,
          onComplete: () => (this.isMoving = false),
        });
        break;
      default:
        break;
    }
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
   * Checks for an obstacle in front of the object.
   * @param {number} facing Facing constant to determine direction of check.
   * @returns Whether or not an obstacle was found.
   */
  checkObstacle(facing) {
    const Rectangle = Phaser.Geom.Rectangle;
    let hitObstacle = false;

    for (const obs of this.scene.obstacles) {
      const bounds = obs.getBounds();
      switch (facing) {
        case FACING_DOWN:
          hitObstacle = Rectangle.Contains(
            bounds,
            this.sprite.x,
            this.sprite.y + this.scene.gridSize
          );
          break;
        case FACING_UP:
          hitObstacle = Rectangle.Contains(
            bounds,
            this.sprite.x,
            this.sprite.y - this.scene.gridSize
          );
          break;
        case FACING_LEFT:
          hitObstacle = Rectangle.Contains(
            bounds,
            this.sprite.x - this.scene.gridSize,
            this.sprite.y
          );
          break;
        case FACING_RIGHT:
          hitObstacle = Rectangle.Contains(
            bounds,
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
