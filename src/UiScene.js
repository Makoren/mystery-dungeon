import BattleLog from "./BattleLog";
import VirtualJoystick from "./VirtualJoystick";

export default class UiScene extends Phaser.Scene {
  constructor() {
    super("uiScene");
  }

  create(data) {
    const gameSize = this.scale.gameSize;

    this.joystick = new VirtualJoystick(this);
    this.battleLog = new BattleLog(this);

    this.healthLabelBg = this.add.rectangle(0, 0, 100, 60, 0x000000);
    this.healthLabelBg.alpha = 0.1;
    this.healthLabelBg.setOrigin(1, 0);
    this.healthLabel = this.add.text(0, 20, "3/3");
    this.healthLabel.setOrigin(1, 0);

    this.scale.on("resize", this.onResize, this);
    this.onResize(gameSize);

    this.events.on("updateHealth", this.onUpdateHealth, this);
    this.onUpdateHealth(data.currentHealth, data.maxHealth);
  }

  /**
   * @param {Phaser.Structs.Size} gameSize
   */
  onResize(gameSize) {
    this.joystick.reposition(gameSize);

    this.healthLabel.x = gameSize.width - 20;
    this.healthLabelBg.x = gameSize.width;
  }

  /**
   * @param {number} currentHealth
   * @param {number} maxHealth
   */
  onUpdateHealth(currentHealth, maxHealth) {
    this.healthLabel.text = `HP: ${currentHealth}/${maxHealth}`;
  }
}
