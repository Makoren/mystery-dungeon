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
}
