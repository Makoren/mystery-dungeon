const FACING_DOWN = 0;
const FACING_UP = 1;
const FACING_LEFT = 2;
const FACING_RIGHT = 3;

export default class Enemy {
  constructor(scene, x, y, depth) {
    this.scene = scene;
    this.facing = FACING_DOWN;
    this.isMoving = false;

    scene.anims.create({
      key: "enemyIdleDown",
      frames: scene.anims.generateFrameNumbers("enemySheet", { frames: [0] }),
      frameRate: 8,
      repeat: -1,
    });

    scene.anims.create({
      key: "enemyIdleUp",
      frames: scene.anims.generateFrameNumbers("enemySheet", { frames: [1] }),
      frameRate: 8,
      repeat: -1,
    });

    scene.anims.create({
      key: "enemyIdleLeft",
      frames: scene.anims.generateFrameNumbers("enemySheet", { frames: [2] }),
      frameRate: 8,
      repeat: -1,
    });

    scene.anims.create({
      key: "enemyIdleRight",
      frames: scene.anims.generateFrameNumbers("enemySheet", { frames: [3] }),
      frameRate: 8,
      repeat: -1,
    });

    scene.anims.create({
      key: "enemyWalkDown",
      frames: scene.anims.generateFrameNumbers("enemySheet", {
        frames: [0, 4, 8, 12],
      }),
      frameRate: 8,
      repeat: -1,
    });

    scene.anims.create({
      key: "enemyWalkUp",
      frames: scene.anims.generateFrameNumbers("enemySheet", {
        frames: [1, 5, 9, 13],
      }),
      frameRate: 8,
      repeat: -1,
    });

    scene.anims.create({
      key: "enemyWalkLeft",
      frames: scene.anims.generateFrameNumbers("enemySheet", {
        frames: [2, 6, 10, 14],
      }),
      frameRate: 8,
      repeat: -1,
    });

    scene.anims.create({
      key: "enemyWalkRight",
      frames: scene.anims.generateFrameNumbers("enemySheet", {
        frames: [3, 7, 11, 15],
      }),
      frameRate: 8,
      repeat: -1,
    });

    this.sprite = scene.add.sprite(x, y);
    this.sprite.setDepth(depth);
    this.sprite.play("enemyWalkDown");
  }
}
