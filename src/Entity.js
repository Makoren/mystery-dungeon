/**
 * Base class for all objects in the game.
 */
export default class Entity {
  /**
   * @param {Phaser.Geom.Rectangle} rect A rectangle used for obstacle checking.
   */
  constructor(rect) {
    /** @type {Phaser.Geom.Rectangle} */
    this.rect = rect;

    /** @type {string} */
    this.tag = "";

    /** @type {Entity} */
    this.parent = undefined;

    /** @type {number} */
    this.maxHealth = 2;

    /** @type {number} */
    this.health = this.maxHealth;
  }

  /**
   * Take the specified amount of damage, which is subtracted from your `health`.
   * @param {number} amount The amount of damage to take.
   * @param {any} deathCallback The callback to call when `health` reaches zero.
   */
  damage(amount, deathCallback) {
    this.health -= amount;

    if (this.health <= 0) {
      deathCallback();
    }
  }

  /**
   * Method stub for subclasses. Does nothing on the Entity base class.
   */
  destroy() {
    console.error("Destroy not implemented on this class");
  }
}
