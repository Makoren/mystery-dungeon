export default class MainScene extends Phaser.Scene {
  constructor() {
    super("mainScene");
  }

  preload() {}

  create() {
    this.add.text(16, 16, "Hello Phaser!");
  }

  update() {}
}
