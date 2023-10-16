import UiScene from "./UiScene";

export default class MainScene extends Phaser.Scene {
  constructor() {
    super("mainScene");
  }

  create() {
    this.tilemap = this.createTilemap();
    this.player = this.createPlayer();

    // FIXME: Set zoom based on screen size if needed.
    this.cameras.main.setZoom(2);
    this.cameras.main.startFollow(this.player, true, 1, 1, 0, -60);

    this.scene.launch("uiScene");

    /**
     * @type {UiScene}
     */
    this.uiScene = this.scene.get("uiScene");
  }

  update() {
    this.movePlayer();
  }

  createTilemap() {
    const map = this.make.tilemap({ key: "tilemap" });

    const tilesetInteriorFloor = map.addTilesetImage(
      "TilesetInteriorFloor",
      "tilesetInteriorFloor"
    );

    const tilesetInterior = map.addTilesetImage(
      "TilesetInterior",
      "tilesetInterior"
    );

    const floorLayer = map.createLayer("floor", tilesetInteriorFloor);
    const wallsLayer = map.createLayer("walls", tilesetInterior);

    return map;
  }

  createPlayer() {
    this.anims.create({
      key: "idleDown",
      frames: this.anims.generateFrameNumbers("playerSheet", { frames: [0] }),
      frameRate: 8,
      repeat: -1,
    });

    this.anims.create({
      key: "idleUp",
      frames: this.anims.generateFrameNumbers("playerSheet", { frames: [1] }),
      frameRate: 8,
      repeat: -1,
    });

    this.anims.create({
      key: "idleLeft",
      frames: this.anims.generateFrameNumbers("playerSheet", { frames: [2] }),
      frameRate: 8,
      repeat: -1,
    });

    this.anims.create({
      key: "idleRight",
      frames: this.anims.generateFrameNumbers("playerSheet", { frames: [3] }),
      frameRate: 8,
      repeat: -1,
    });

    this.anims.create({
      key: "walkDown",
      frames: this.anims.generateFrameNumbers("playerSheet", {
        frames: [0, 4, 8, 12],
      }),
      frameRate: 8,
      repeat: -1,
    });

    this.anims.create({
      key: "walkUp",
      frames: this.anims.generateFrameNumbers("playerSheet", {
        frames: [1, 5, 9, 13],
      }),
      frameRate: 8,
      repeat: -1,
    });

    this.anims.create({
      key: "walkLeft",
      frames: this.anims.generateFrameNumbers("playerSheet", {
        frames: [2, 6, 10, 14],
      }),
      frameRate: 8,
      repeat: -1,
    });

    this.anims.create({
      key: "walkRight",
      frames: this.anims.generateFrameNumbers("playerSheet", {
        frames: [3, 7, 11, 15],
      }),
      frameRate: 8,
      repeat: -1,
    });

    const player = this.add.sprite(100, 100);
    player.play("walkDown");

    return player;
  }

  movePlayer() {
    const joystick = this.uiScene.joystick;
    this.player.x += Math.round(joystick.getXAxis());
    this.player.y += Math.round(joystick.getYAxis());
  }
}
