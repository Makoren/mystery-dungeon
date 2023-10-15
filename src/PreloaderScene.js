export default class PreloaderScene extends Phaser.Scene {
  constructor() {
    super("preloaderScene");
  }

  preload() {
    // Tilemap
    this.load.image("tilesetInterior", "tilemaps/TilesetInterior.png");
    this.load.image(
      "tilesetInteriorFloor",
      "tilemaps/TilesetInteriorFloor.png"
    );
    this.load.tilemapTiledJSON("tilemap", "tilemaps/main.tmj");

    // Player
    this.load.spritesheet("playerSheet", "player/playerSheet.png", {
      frameWidth: 16,
      frameHeight: 16,
    });

    // Joystick
    this.load.image("joystickKnob", "joystick/knob.png");
    this.load.image("joystickBg", "joystick/bg.png");
  }

  create() {
    this.scene.switch("mainScene");
  }
}
