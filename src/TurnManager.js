/**
 * Used to manage the turns between objects using a queue. Each object is added manually to the queue using `add`.
 */
export default class TurnManager {
  constructor(scene) {
    this.objects = [];
    scene.events.on("nextTurn", this.onNextTurn, this);
  }

  /**
   * Adds an object to the turn manager queue. The first object added moves first.
   * @param {any} obj The object to add to the manager.
   */
  add(obj) {
    this.objects.push(obj);
  }

  onNextTurn() {
    const obj = this.objects.shift();
    this.objects.push(obj);
    this.startNextTurn();
  }

  startNextTurn() {
    const obj = this.objects[0];
    if (obj && obj.startTurn !== undefined) {
      obj.startTurn();
    }
  }
}
