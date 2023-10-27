/**
 * A positioning object used on the player to anchor it to a position, as well as have the camera follow it.
 */
export default class Position extends Phaser.GameObjects.GameObject {
  /**
   * @param {Phaser.Scene} scene The current scene.
   * @param {number} x The initial X position.
   * @param {number} y The initial Y position.
   */
  constructor(scene, x, y) {
    super(scene);
    this.x = x;
    this.y = y;
  }

  /**
   * Updates the position of this object to the specified X and Y values.
   * @param {number} x The new X position.
   * @param {number} y The new Y position.
   */
  updatePosition(x, y) {
    this.x = x;
    this.y = y;
  }
}
