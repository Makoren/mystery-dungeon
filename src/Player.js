import Position from "./Position";
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
    this.isAttacking = false;
    this.isTurnActive = true;
    this.isDestroyed = false;

    this.sprite = scene.add.sprite(x, y);
    this.sprite.setDepth(depth);
    this.tag = "player";

    const targetCellRect = new Phaser.Geom.Rectangle(
      this.sprite.x - this.scene.gridSize / 2,
      this.sprite.y - this.scene.gridSize / 2,
      16,
      16
    );
    this.targetCell = new Entity(targetCellRect);
    this.targetCell.parent = this;
    this.targetCellIndex = scene.obstacles.push(this.targetCell) - 1;

    this.centerObject = new Position(scene, this.sprite.x, this.sprite.y);

    scene.events.on("playerAttack", this.attack, this);
    scene.events.on("playerTurn", this.onPlayerTurn, this);

    this.maxHealth = 5;
    this.health = this.maxHealth;
  }

  onPlayerTurn() {
    this.isTurnActive = true;
  }

  /**
   * Moves and animates the player.
   */
  update() {
    if (this.isDestroyed) return;

    this.move();
    this.animate();
  }

  /**
   * @private
   * Attempt to move the player with the joystick axes after checking for obstacles. Called internally.
   */
  move() {
    const joystick = this.scene.uiScene.joystick;

    if (joystick && !this.isMoving && !this.isAttacking && this.isTurnActive) {
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

        const entity = this.checkObstacle(this.facing);
        if (entity === null) {
          this.moveInDirection(this.facing);
        }
      }
    }

    this.sprite.y = Math.round(this.sprite.y);

    this.centerObject.x = Math.round(this.centerObject.x);
    this.centerObject.y = Math.round(this.centerObject.y);
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
          targets: [this.sprite, this.centerObject],
          y: nextPosY,
          duration: tweenDuration,
          onComplete: () => (this.isMoving = false),
        });
        break;
      case FACING_UP:
        nextPosY = this.sprite.y - this.scene.gridSize;
        this.targetCell.rect.y = nextPosY - this.scene.gridSize / 2;

        this.scene.add.tween({
          targets: [this.sprite, this.centerObject],
          y: nextPosY,
          duration: tweenDuration,
          onComplete: () => (this.isMoving = false),
        });
        break;
      case FACING_LEFT:
        nextPosX = this.sprite.x - this.scene.gridSize;
        this.targetCell.rect.x = nextPosX - this.scene.gridSize / 2;

        this.scene.add.tween({
          targets: [this.sprite, this.centerObject],
          x: nextPosX,
          duration: tweenDuration,
          onComplete: () => (this.isMoving = false),
        });
        break;
      case FACING_RIGHT:
        nextPosX = this.sprite.x + this.scene.gridSize;
        this.targetCell.rect.x = nextPosX - this.scene.gridSize / 2;

        this.scene.add.tween({
          targets: [this.sprite, this.centerObject],
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
    this.scene.events.emit("processTurns");
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
    } else if (!this.isAttacking) {
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
   * Checks for an obstacle in front of the object using its bounds. This function iterates over the scene's `obstacles` and `staticObstacles`. Not to be confused with the `MainScene` function of the same name.
   * @param {number} facing Facing constant to determine direction of check.
   * @returns The obstacle that was found.
   */
  checkObstacle(facing) {
    const Rectangle = Phaser.Geom.Rectangle;
    let hitObstacle = null;

    const entities = this.scene.obstacles.concat(this.scene.staticObstacles);

    for (const entity of entities) {
      switch (facing) {
        case FACING_DOWN:
          if (!entity || !entity.rect) break;
          if (
            Rectangle.Contains(
              entity.rect,
              this.sprite.x,
              this.sprite.y + this.scene.gridSize
            )
          ) {
            hitObstacle = entity;
          }
          break;
        case FACING_UP:
          if (!entity || !entity.rect) break;
          if (
            Rectangle.Contains(
              entity.rect,
              this.sprite.x,
              this.sprite.y - this.scene.gridSize
            )
          ) {
            hitObstacle = entity;
          }
          break;
        case FACING_LEFT:
          if (!entity || !entity.rect) break;
          if (
            Rectangle.Contains(
              entity.rect,
              this.sprite.x - this.scene.gridSize,
              this.sprite.y
            )
          ) {
            hitObstacle = entity;
          }
          break;
        case FACING_RIGHT:
          if (!entity || !entity.rect) break;
          if (
            Rectangle.Contains(
              entity.rect,
              this.sprite.x + this.scene.gridSize,
              this.sprite.y
            )
          ) {
            hitObstacle = entity;
          }
          break;
        default:
          break;
      }

      if (hitObstacle !== null) break;
    }

    return hitObstacle;
  }

  /**
   * Attacks in the current facing direction. If there is an enemy in the way, damage it. Emits the `"nextTurn"` event at the end of the animation.
   */
  attack() {
    // player shouldn't attack if already attacking
    if (this.isAttacking || this.isMoving) return;
    if (!this.isTurnActive) return;
    if (this.isDestroyed) return;

    this.isAttacking = true;

    let moveX = 0;
    let moveY = 0;
    const speed = 8;
    let playerAttackAnim = "playerAttackDown";
    let playerIdleAnim = "playerIdleDown";

    switch (this.facing) {
      case FACING_DOWN:
        moveY = speed;
        playerAttackAnim = "playerAttackDown";
        playerIdleAnim = "playerIdleDown";
        break;
      case FACING_UP:
        moveY = -speed;
        playerAttackAnim = "playerAttackUp";
        playerIdleAnim = "playerIdleUp";
        break;
      case FACING_LEFT:
        moveX = -speed;
        playerAttackAnim = "playerAttackLeft";
        playerIdleAnim = "playerIdleLeft";
        break;
      case FACING_RIGHT:
        moveX = speed;
        playerAttackAnim = "playerAttackRight";
        playerIdleAnim = "playerIdleRight";
        break;
      default:
        break;
    }

    const entityToAttack = this.checkObstacle(this.facing);
    this.scene.uiScene.battleLog.add("Player attacks!");

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
          onStart: () => this.sprite.play(playerAttackAnim),
          onComplete: () => this.attackEntity(entityToAttack),
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
        this.isTurnActive = false;

        this.scene.events.emit("processTurns");
        this.scene.events.emit("nextTurn");
      },
    });
  }

  /**
   * Attack a specific entity, which in turn calls its damage() method.
   * @param {Entity} entity The entity to attack.
   */
  attackEntity(entity) {
    if (
      entity !== null &&
      entity.parent !== undefined &&
      entity.parent.tag === "enemy"
    ) {
      entity.parent.damage(1, () => entity.parent.destroy());
    }
  }

  damage(amount, deathCallback) {
    this.scene.uiScene.battleLog.add(`Player took ${amount} damage!`);
    super.damage(amount, deathCallback);
    this.scene.uiScene.events.emit("updateHealth", this.health, this.maxHealth);
  }

  /**
   * Destroy each component of the player, making it inactive.
   */
  destroy() {
    this.scene.uiScene.battleLog.add(`Player has been defeated!`);
    this.isDestroyed = true;
    this.scene.obstacles.splice(this.targetCellIndex, 1);
    this.sprite.destroy();
    this.centerObject.destroy();
    this.targetCell.rect = undefined;
    this.targetCell.parent = undefined;
    this.targetCell = undefined;
  }
}
