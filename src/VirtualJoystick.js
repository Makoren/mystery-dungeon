export default class VirtualJoystick {
  /**
   * A virtual joystick for controlling the player. Emits axis values based on the direction it is dragged.
   * @param {Phaser.Scene} scene The current scene.
   */
  constructor(scene) {
    /**
     * @private
     */
    this.scene = scene;

    const gameSize = scene.scale.gameSize;

    /**
     * @private
     */
    this.bg = scene.add.image(0, 0, "joystickBg");
    this.setupImage(this.bg);

    /**
     * @private
     */
    this.knob = scene.add.image(0, 0, "joystickKnob");
    this.setupImage(this.knob);

    /**
     * @private
     */
    this.zone = scene.add.zone(0, 0, 128, 128);
    this.zone.alpha = 0.25;
    this.zone.setOrigin(0, 0);
    this.zone.setScrollFactor(0);

    this.zone.setInteractive();
    this.zone.on("pointerdown", this.onPointerDown, this);
    scene.input.on("pointerup", this.onPointerUp, this);
    scene.input.on("pointermove", this.onPointerMove, this);

    this.reposition(gameSize);

    /**
     * @private
     */
    this.isDragging = false;

    /**
     * @private
     */
    this.originalPosX = this.bg.x;

    /**
     * @private
     */
    this.originalPosY = this.bg.y;

    /**
     * @private
     */
    this.touchStartPosX = this.originalPosX;

    /**
     * @private
     */
    this.touchStartPosY = this.originalPosY;

    /**
     * @private
     */
    this.currentTouchPosX = this.originalPosX;

    /**
     * @private
     */
    this.currentTouchPosY = this.originalPosY;

    /**
     * @private
     */
    this.joystickMovementX = 0;

    /**
     * @private
     */
    this.joystickMovementY = 0;

    /**
     * @private
     */
    this.threshold = 100;
  }

  /**
   * Reposition all joystick objects to their correct positions. Usually triggered on resize.
   * @param {Phaser.Structs.Size} newSize The new screen size.
   */
  reposition(newSize) {
    this.bg.x = newSize.width / 2;
    this.bg.y = newSize.height - 150;

    this.knob.x = newSize.width / 2;
    this.knob.y = newSize.height - 150;

    this.zone.x = 0;
    this.zone.y = newSize.height - 300;
    this.zone.width = newSize.width;
    this.zone.height = 300;

    this.zone.input.hitArea.setTo(0, 0, this.zone.width, this.zone.height);

    if (this.originalPos) {
      this.originalPos.x = this.bg.x;
      this.originalPos.y = this.bg.y;
    }
  }

  /**
   * Get the normalized X axis value of the joystick. Used for input handling.
   * @returns {number}
   */
  getXAxis() {
    return this.joystickMovementX / this.threshold;
  }

  /**
   * Get the normalized Y axis value of the joystick. Used for input handling.
   * @returns {number}
   */
  getYAxis() {
    return this.joystickMovementY / this.threshold;
  }

  /**
   * Align the image to the correct position. Used for the knob and background.
   * @private
   * @param {Phaser.GameObjects.Image} image The image to align.
   */
  setupImage(image) {
    image.alpha = 0.5;
    image.setScrollFactor(0);
  }

  /**
   * @private
   */
  onPointerDown(pointer, localX, localY, event) {
    this.isDragging = true;
    this.touchStartPosX = pointer.x;
    this.touchStartPosY = pointer.y;
    this.knob.setPosition(this.touchStartPosX, this.touchStartPosY);
    this.bg.setPosition(this.touchStartPosX, this.touchStartPosY);
  }

  /**
   * @private
   */
  onPointerUp(pointer, currentlyOver) {
    if (!this.isDragging) return;

    this.isDragging = false;
    this.touchStartPosX = this.originalPosX;
    this.touchStartPosY = this.originalPosY;
    this.currentTouchPosX = this.originalPosX;
    this.currentTouchPosY = this.originalPosY;
    this.joystickMovementX = 0;
    this.joystickMovementY = 0;
    this.knob.setPosition(this.originalPosX, this.originalPosY);
    this.bg.setPosition(this.originalPosX, this.originalPosY);
  }

  /**
   * @private
   */
  onPointerMove(pointer, currentlyOver) {
    if (!this.isDragging) return;

    this.currentTouchPosX = pointer.x;
    this.currentTouchPosY = pointer.y;

    const distanceX = this.currentTouchPosX - this.touchStartPosX;
    const distanceY = this.currentTouchPosY - this.touchStartPosY;
    const angle = Math.atan2(distanceY, distanceX);
    const length = Math.sqrt(distanceX ** 2 + distanceY ** 2);

    this.joystickMovementX = this.clamp(
      distanceX,
      -this.threshold,
      this.threshold
    );
    this.joystickMovementY = this.clamp(
      distanceY,
      -this.threshold,
      this.threshold
    );

    const newDistance = Math.min(length, this.threshold);
    const newX = this.touchStartPosX + Math.cos(angle) * newDistance;
    const newY = this.touchStartPosY + Math.sin(angle) * newDistance;

    this.knob.setPosition(newX, newY);
  }

  /**
   * Limits the passed number between a minimum and maximum value, and returns the result.
   *
   * Used internally.
   * @private
   * @param {number} num The number to clamp.
   * @param {number} min The minimum value.
   * @param {number} max The maximum value.
   * @returns The resulting value between min and max.
   */
  clamp(num, min, max) {
    return Math.min(Math.max(num, min), max);
  }
}
