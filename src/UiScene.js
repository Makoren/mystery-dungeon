import VirtualJoystick from "./VirtualJoystick";

export default class UiScene extends Phaser.Scene {
  constructor() {
    super("uiScene");
  }

  create() {
    this.joystick = new VirtualJoystick(this);
    this.scale.on("resize", this.onResize, this);
  }

  onResize(gameSize) {
    this.joystick.reposition(gameSize);
  }
}
