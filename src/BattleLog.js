/**
 * A simple log that keeps track of the game's most recent actions.
 */
export default class BattleLog {
  /**
   * @param {Phaser.Scene} scene The scene to add the log's text objects to.
   */
  constructor(scene) {
    /** @type {string[]} */
    this.log = [];

    /** @type {Phaser.GameObjects.Text[]} */
    this.textObjects = [];

    this.panel = scene.add.rectangle(0, 0, 520, 300, 0x000000);
    this.panel.alpha = 0.1;

    for (let i = 0; i < 5; i++) {
      const obj = scene.add.text(20, 20 + 24 * i, "");
      this.textObjects.push(obj);
    }
  }

  /**
   * Add a text string to the log and update its display.
   * @param {string} text The text string to add to the log.
   */
  add(text) {
    this.log.unshift(text);
    this.updateTextObjects();
  }

  /**
   * @private
   * Update the text objects to match the log. Used internally.
   */
  updateTextObjects() {
    for (let i = 0; i < this.textObjects.length; i++) {
      this.textObjects[i].text = this.log[i];
    }
  }
}
