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
   */
  constructor(scene) {
    this.scene = scene;
    this.facing = FACING_DOWN;

    scene.anims.create({
      key: "idleDown",
      frames: scene.anims.generateFrameNumbers("playerSheet", { frames: [0] }),
      frameRate: 8,
      repeat: -1,
    });

    scene.anims.create({
      key: "idleUp",
      frames: scene.anims.generateFrameNumbers("playerSheet", { frames: [1] }),
      frameRate: 8,
      repeat: -1,
    });

    scene.anims.create({
      key: "idleLeft",
      frames: scene.anims.generateFrameNumbers("playerSheet", { frames: [2] }),
      frameRate: 8,
      repeat: -1,
    });

    scene.anims.create({
      key: "idleRight",
      frames: scene.anims.generateFrameNumbers("playerSheet", { frames: [3] }),
      frameRate: 8,
      repeat: -1,
    });

    scene.anims.create({
      key: "walkDown",
      frames: scene.anims.generateFrameNumbers("playerSheet", {
        frames: [0, 4, 8, 12],
      }),
      frameRate: 8,
      repeat: -1,
    });

    scene.anims.create({
      key: "walkUp",
      frames: scene.anims.generateFrameNumbers("playerSheet", {
        frames: [1, 5, 9, 13],
      }),
      frameRate: 8,
      repeat: -1,
    });

    scene.anims.create({
      key: "walkLeft",
      frames: scene.anims.generateFrameNumbers("playerSheet", {
        frames: [2, 6, 10, 14],
      }),
      frameRate: 8,
      repeat: -1,
    });

    scene.anims.create({
      key: "walkRight",
      frames: scene.anims.generateFrameNumbers("playerSheet", {
        frames: [3, 7, 11, 15],
      }),
      frameRate: 8,
      repeat: -1,
    });

    this.sprite = scene.add.sprite(100, 100);
    this.sprite.play("walkDown");

    this.previousX = this.sprite.x;
    this.previousY = this.sprite.y;
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
   * Move and face the player based on joystick axis.
   */
  move() {
    const joystick = this.scene.uiScene.joystick;
    if (joystick) {
      const xMove = Math.round(joystick.getXAxis());
      const yMove = Math.round(joystick.getYAxis());
      this.previousX = this.sprite.x;
      this.previousY = this.sprite.y;
      this.sprite.x += xMove;
      this.sprite.y += yMove;

      if (xMove > 0) {
        this.facing = FACING_RIGHT;
      } else if (xMove < 0) {
        this.facing = FACING_LEFT;
      } else if (yMove > 0) {
        this.facing = FACING_DOWN;
      } else if (yMove < 0) {
        this.facing = FACING_UP;
      }
    }
  }

  /**
   * @private
   * Animate the player based on the direction it's facing.
   */
  animate() {
    // if the player has moved, play walking animations
    if (this.sprite.x !== this.previousX || this.sprite.y !== this.previousY) {
      switch (this.facing) {
        case FACING_DOWN:
          this.sprite.play("walkDown", true);
          break;

        case FACING_UP:
          this.sprite.play("walkUp", true);
          break;

        case FACING_LEFT:
          this.sprite.play("walkLeft", true);
          break;

        case FACING_RIGHT:
          this.sprite.play("walkRight", true);
          break;

        default:
          break;
      }
    } else {
      switch (this.facing) {
        case FACING_DOWN:
          this.sprite.play("idleDown", true);
          break;

        case FACING_UP:
          this.sprite.play("idleUp", true);
          break;

        case FACING_LEFT:
          this.sprite.play("idleLeft", true);
          break;

        case FACING_RIGHT:
          this.sprite.play("idleRight", true);
          break;

        default:
          break;
      }
    }
  }
}
