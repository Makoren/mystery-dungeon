import Phaser from "phaser";
import PreloaderScene from "./PreloaderScene.js";
import MainScene from "./MainScene.js";
import UiScene from "./UiScene.js";

/**
 * @type Phaser.Types.Core.GameConfig
 */
const config = {
  type: Phaser.AUTO,
  width: 320,
  height: 480,
  scene: [PreloaderScene, MainScene, UiScene],
  pixelArt: true,
  scale: {
    mode: Phaser.Scale.ScaleModes.RESIZE,
  },
};

const game = new Phaser.Game(config);
