import VirtualJoystick from "./VirtualJoystick";

export default class UiScene extends Phaser.Scene {
  constructor() {
    super("uiScene");
  }

  create(data) {
    const gameSize = this.scale.gameSize;

    this.joystick = new VirtualJoystick(this);

    // FIXME: the coordinates for the BG are way off for some reason
    this.healthLabelBg = this.add.rectangle(0, 20, 100, 100, 0x000000);
    this.healthLabelBg.alpha = 0.3;
    this.healthLabelBg.setOrigin(0.5, 0.5);
    this.healthLabel = this.add.text(0, 40, "3/3");
    this.healthLabel.setOrigin(0.5, 0.5);

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

    this.healthLabel.x = gameSize.width / 2;
    this.healthLabelBg.x = gameSize.width / 2;
  }

  /**
   * @param {number} currentHealth
   * @param {number} maxHealth
   */
  onUpdateHealth(currentHealth, maxHealth) {
    this.healthLabel.text = `${currentHealth}/${maxHealth}`;
  }
}
