/**
 * Used to manage the turns between objects using a queue. Each object is added manually to the queue using `add`.
 */
export default class TurnManager {
  constructor() {
    this.objects = [];
  }

  /**
   * Adds an object to the turn manager queue. The first object added moves first.
   * @param {any} obj The object to add to the manager.
   */
  add(obj) {
    this.objects.push(obj);
  }
}
