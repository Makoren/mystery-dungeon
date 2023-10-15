export default class VirtualJoystick {
  /**
   * A virtual joystick for controlling the player. Emits axis values based on the direction it is dragged.
   * @param {Phaser.Scene} scene The current scene.
   */
  constructor(scene) {
    this.scene = scene;

    this.bg = scene.add.image(0, 0, "joystickBg");
    this.setupImage(this.bg);

    this.knob = scene.add.image(0, 0, "joystickKnob");
    this.setupImage(this.knob);

    // TODO: Each joystick element (and every UI element for that matter)
    // should be responsive to different screen sizes, use Chrome mobile mode
    // to test
    this.zone = scene.add.rectangle(0, 0, 128, 128, 0xff00ff);
    this.zone.alpha = 0.25;
    this.zone.setScrollFactor(0);

    this.reposition();
  }

  /**
   * Align the image to the correct position. Used for the knob and background.
   * @param {Phaser.GameObjects.Image} image The image to align.
   */
  setupImage(image) {
    image.alpha = 0.5;
    image.scale = 0.5;
    image.setScrollFactor(0);
  }

  /**
   * Reposition all joystick objects to their correct positions. Usually triggered on resize.
   */
  reposition() {
    this.bg.x = this.scene.scale.gameSize.width / 2;
    this.bg.y = this.scene.scale.gameSize.height / 2;
    this.knob.x = this.scene.scale.gameSize.width / 2;
    this.knob.y = this.scene.scale.gameSize.height / 2;

    // TODO: Try adding new scenes to the game to represent UI elements.
    // One idea is to add a scene on top with no zoom.
    // If the game size is permanently messed up because of zoom, then
    // try making a root scene with no zoom.
  }
}
