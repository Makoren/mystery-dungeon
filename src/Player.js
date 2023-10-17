export default class Player {
  constructor(scene) {
    this.scene = scene;

    scene.anims.create({
      key: "idleDown",
      frames: scene.anims.generateFrameNumbers("playerSheet", { frames: [0] }),
      frameRate: 8,
      repeat: -1,
    });

    scene.anims.create({
      key: "idleUp",
      frames: scene.anims.generateFrameNumbers("playerSheet", { frames: [1] }),
      frameRate: 8,
      repeat: -1,
    });

    scene.anims.create({
      key: "idleLeft",
      frames: scene.anims.generateFrameNumbers("playerSheet", { frames: [2] }),
      frameRate: 8,
      repeat: -1,
    });

    scene.anims.create({
      key: "idleRight",
      frames: scene.anims.generateFrameNumbers("playerSheet", { frames: [3] }),
      frameRate: 8,
      repeat: -1,
    });

    scene.anims.create({
      key: "walkDown",
      frames: scene.anims.generateFrameNumbers("playerSheet", {
        frames: [0, 4, 8, 12],
      }),
      frameRate: 8,
      repeat: -1,
    });

    scene.anims.create({
      key: "walkUp",
      frames: scene.anims.generateFrameNumbers("playerSheet", {
        frames: [1, 5, 9, 13],
      }),
      frameRate: 8,
      repeat: -1,
    });

    scene.anims.create({
      key: "walkLeft",
      frames: scene.anims.generateFrameNumbers("playerSheet", {
        frames: [2, 6, 10, 14],
      }),
      frameRate: 8,
      repeat: -1,
    });

    scene.anims.create({
      key: "walkRight",
      frames: scene.anims.generateFrameNumbers("playerSheet", {
        frames: [3, 7, 11, 15],
      }),
      frameRate: 8,
      repeat: -1,
    });

    this.sprite = scene.add.sprite(100, 100);
    this.sprite.play("walkDown");
  }

  move() {
    const joystick = this.scene.uiScene.joystick;
    if (joystick) {
      this.sprite.x += Math.round(joystick.getXAxis());
      this.sprite.y += Math.round(joystick.getYAxis());
    }
  }
}
