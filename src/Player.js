const FACING_DOWN = 0;
const FACING_UP = 1;
const FACING_LEFT = 2;
const FACING_RIGHT = 3;

/**
 * The player character, controlled by input methods.
 */
export default class Player {
  /**
   * @param {Phaser.Scene} scene The current scene.
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
   * Move the player along a grid with the joystick axes.
   */
  move() {
    const joystick = this.scene.uiScene.joystick;

    if (joystick && !this.isMoving) {
      const xMove = joystick.getXAxis();
      const yMove = joystick.getYAxis();
      const angle = Math.atan2(yMove, xMove);
      const angleDegrees = angle * (180 / Math.PI);
      const length = Math.sqrt(xMove ** 2 + yMove ** 2);
      const threshold = 0.25;
      const tweenDuration = 250;

      if (length > threshold) {
        this.isMoving = true;
        if (!this.scene.gridSize) {
          console.error("No grid size defined on scene");
          return;
        }

        if (angleDegrees < 45 && angleDegrees >= -45) {
          // move right
          this.scene.add.tween({
            targets: this.sprite,
            x: this.sprite.x + this.scene.gridSize,
            duration: tweenDuration,
            onComplete: () => (this.isMoving = false),
          });
          this.facing = FACING_RIGHT;
        } else if (angleDegrees > -135 && angleDegrees <= -45) {
          // move up
          this.scene.add.tween({
            targets: this.sprite,
            y: this.sprite.y - this.scene.gridSize,
            duration: tweenDuration,
            onComplete: () => (this.isMoving = false),
          });
          this.facing = FACING_UP;
        } else if (angleDegrees < 135 && angleDegrees >= 45) {
          // move down
          this.scene.add.tween({
            targets: this.sprite,
            y: this.sprite.y + this.scene.gridSize,
            duration: tweenDuration,
            onComplete: () => (this.isMoving = false),
          });
          this.facing = FACING_DOWN;
        } else if (angleDegrees >= 135 || angleDegrees <= -135) {
          // move left
          this.scene.add.tween({
            targets: this.sprite,
            x: this.sprite.x - this.scene.gridSize,
            duration: tweenDuration,
            onComplete: () => (this.isMoving = false),
          });
          this.facing = FACING_LEFT;
        }
      }
    }

    this.sprite.x = Math.round(this.sprite.x);
    this.sprite.y = Math.round(this.sprite.y);
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
}
