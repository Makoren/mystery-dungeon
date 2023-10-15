import Phaser from "phaser";
import PreloaderScene from "./PreloaderScene.js";
import MainScene from "./MainScene.js";

/**
 * @type Phaser.Types.Core.GameConfig
 */
const config = {
  type: Phaser.AUTO,
  width: 320,
  height: 480,
  scene: [PreloaderScene, MainScene],
  pixelArt: true,
  scale: {
    mode: Phaser.Scale.ScaleModes.RESIZE,
  },
};

const game = new Phaser.Game(config);
