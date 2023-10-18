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

    // Enemy
    this.load.spritesheet("enemySheet", "enemies/enemySheet.png", {
      frameWidth: 16,
      frameHeight: 16,
    });

    // Joystick
    this.load.image("joystickKnob", "joystick/knob.png");
    this.load.image("joystickBg", "joystick/bg.png");
  }

  createPlayerAnimations() {
    this.anims.create({
      key: "playerIdleDown",
      frames: this.anims.generateFrameNumbers("playerSheet", { frames: [0] }),
      frameRate: 8,
      repeat: -1,
    });

    this.anims.create({
      key: "playerIdleUp",
      frames: this.anims.generateFrameNumbers("playerSheet", { frames: [1] }),
      frameRate: 8,
      repeat: -1,
    });

    this.anims.create({
      key: "playerIdleLeft",
      frames: this.anims.generateFrameNumbers("playerSheet", { frames: [2] }),
      frameRate: 8,
      repeat: -1,
    });

    this.anims.create({
      key: "playerIdleRight",
      frames: this.anims.generateFrameNumbers("playerSheet", { frames: [3] }),
      frameRate: 8,
      repeat: -1,
    });

    this.anims.create({
      key: "playerWalkDown",
      frames: this.anims.generateFrameNumbers("playerSheet", {
        frames: [0, 4, 8, 12],
      }),
      frameRate: 8,
      repeat: -1,
    });

    this.anims.create({
      key: "playerWalkUp",
      frames: this.anims.generateFrameNumbers("playerSheet", {
        frames: [1, 5, 9, 13],
      }),
      frameRate: 8,
      repeat: -1,
    });

    this.anims.create({
      key: "playerWalkLeft",
      frames: this.anims.generateFrameNumbers("playerSheet", {
        frames: [2, 6, 10, 14],
      }),
      frameRate: 8,
      repeat: -1,
    });

    this.anims.create({
      key: "playerWalkRight",
      frames: this.anims.generateFrameNumbers("playerSheet", {
        frames: [3, 7, 11, 15],
      }),
      frameRate: 8,
      repeat: -1,
    });
  }

  createEnemyAnimations() {
    this.anims.create({
      key: "enemyIdleDown",
      frames: this.anims.generateFrameNumbers("enemySheet", { frames: [0] }),
      frameRate: 8,
      repeat: -1,
    });

    this.anims.create({
      key: "enemyIdleUp",
      frames: this.anims.generateFrameNumbers("enemySheet", { frames: [1] }),
      frameRate: 8,
      repeat: -1,
    });

    this.anims.create({
      key: "enemyIdleLeft",
      frames: this.anims.generateFrameNumbers("enemySheet", { frames: [2] }),
      frameRate: 8,
      repeat: -1,
    });

    this.anims.create({
      key: "enemyIdleRight",
      frames: this.anims.generateFrameNumbers("enemySheet", { frames: [3] }),
      frameRate: 8,
      repeat: -1,
    });

    this.anims.create({
      key: "enemyWalkDown",
      frames: this.anims.generateFrameNumbers("enemySheet", {
        frames: [0, 4, 8, 12],
      }),
      frameRate: 8,
      repeat: -1,
    });

    this.anims.create({
      key: "enemyWalkUp",
      frames: this.anims.generateFrameNumbers("enemySheet", {
        frames: [1, 5, 9, 13],
      }),
      frameRate: 8,
      repeat: -1,
    });

    this.anims.create({
      key: "enemyWalkLeft",
      frames: this.anims.generateFrameNumbers("enemySheet", {
        frames: [2, 6, 10, 14],
      }),
      frameRate: 8,
      repeat: -1,
    });

    this.anims.create({
      key: "enemyWalkRight",
      frames: this.anims.generateFrameNumbers("enemySheet", {
        frames: [3, 7, 11, 15],
      }),
      frameRate: 8,
      repeat: -1,
    });
  }

  create() {
    this.createPlayerAnimations();
    this.createEnemyAnimations();
    this.scene.switch("mainScene");
  }
}
