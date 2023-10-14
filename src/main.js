import Phaser from "phaser";
import MainScene from "./mainscene.js";

/**
 * @type Phaser.Types.Core.GameConfig
 */
const config = {
  type: Phaser.AUTO,
  width: 320,
  height: 480,
  scene: [MainScene],
  pixelArt: true,
  scale: {
    mode: Phaser.Scale.ScaleModes.RESIZE,
  },
};

const game = new Phaser.Game(config);
