export default class VirtualJoystick {
  /**
   * A virtual joystick for controlling the player. Emits axis values based on the direction it is dragged.
   * @param {Phaser.Scene} scene The current scene.
   */
  constructor(scene) {
    this.scene = scene;

    const gameSize = scene.scale.gameSize;

    this.bg = scene.add.image(0, 0, "joystickBg");
    this.setupImage(this.bg);

    this.knob = scene.add.image(0, 0, "joystickKnob");
    this.setupImage(this.knob);

    this.zone = scene.add.rectangle(0, 0, 128, 128, 0xff00ff);
    this.zone.alpha = 0.25;
    this.zone.setOrigin(0, 0);
    this.zone.setScrollFactor(0);

    this.zone.setInteractive();
    this.zone.on("pointerdown", this.onPointerDown, this);
    scene.input.on("pointerup", this.onPointerUp, this);
    scene.input.on("pointermove", this.onPointerMove, this);

    this.reposition(gameSize);

    this.isDragging = false;
    this.originalPos = new Phaser.Math.Vector2(this.bg.x, this.bg.y);
    this.touchStartPos = this.originalPos.clone();
    this.currentTouchPos = this.originalPos.clone();
    this.threshold = 100;
  }

  /**
   * Align the image to the correct position. Used for the knob and background.
   * @param {Phaser.GameObjects.Image} image The image to align.
   */
  setupImage(image) {
    image.alpha = 0.5;
    image.setScrollFactor(0);
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

  onPointerDown(pointer, localX, localY, event) {
    this.isDragging = true;
    this.touchStartPos.x = pointer.x;
    this.touchStartPos.y = pointer.y;
    this.knob.setPosition(this.touchStartPos.y, this.touchStartPos.y);
    this.bg.setPosition(this.touchStartPos.x, this.touchStartPos.y);
  }

  onPointerUp(pointer, currentlyOver) {
    if (!this.isDragging) return;

    this.isDragging = false;
    this.touchStartPos.x = this.originalPos.x;
    this.touchStartPos.y = this.originalPos.y;
    this.currentTouchPos.x = this.originalPos.x;
    this.currentTouchPos.y = this.originalPos.y;
    this.knob.setPosition(this.originalPos.x, this.originalPos.y);
    this.bg.setPosition(this.originalPos.x, this.originalPos.y);
  }

  onPointerMove(pointer, currentlyOver) {
    if (!this.isDragging) return;

    this.currentTouchPos.x = pointer.x;
    this.currentTouchPos.y = pointer.y;
    this.knob.setPosition(this.currentTouchPos.x, this.currentTouchPos.y);
  }
}
