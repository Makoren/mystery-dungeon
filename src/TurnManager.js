/**
 * Used to manage the turns between objects using a queue.
 *
 * Each object is added manually to the queue using `add`. Process the correct turn order each turn using `processTurns`, and emit the `"nextTurn"` event to the current scene to advance the turn manager.
 */
export default class TurnManager {
  constructor(scene) {
    this.objects = [];
    this.acting = [];
    this.scene = scene;
    scene.events.on("processTurns", this.processTurns, this);
    scene.events.on("nextTurn", this.onNextTurn, this);
  }

  /**
   * Adds an object to the turn manager queue. The first object added moves first.
   * @param {any} obj The object to add to the manager.
   */
  add(obj) {
    this.objects.push(obj);
  }

  /**
   * @private
   * Used internally to handle the `"nextTurn"` event.
   */
  onNextTurn() {
    this.performNextTurn();
  }

  /**
   * Process the turn on each object in the queue, pushing them to either `moving` or `attacking`. The contents of `objects` become the correct order of turns.
   *
   * The `processTurn` method on the object should return 0 for moving, or 1 for attacking.
   */
  processTurns() {
    const moving = [];
    const attacking = [];

    for (const obj of this.objects) {
      if (obj && obj.processTurn !== undefined) {
        const result = obj.processTurn();
        if (result === 0) {
          moving.push(obj);
        } else if (result === 1) {
          attacking.push(obj);
        } else if (result === -1) {
          // do nothing
        } else {
          console.error("Invalid result from processTurn");
        }
      }
    }

    // all attacking enemies act first
    this.acting = attacking.concat(moving);
    console.log(this.objects);
  }

  /**
   * Used to start the next turn. Called by the `"nextTurn"` event.
   *
   * This calls the `startTurn` function on every object in `objects`, if it exists.
   */
  performNextTurn() {
    const obj = this.acting.shift();
    if (obj && obj.startTurn !== undefined) {
      obj.startTurn();
    } else {
      this.scene.events.emit("playerTurn");
    }
  }
}

/*

1. Player moves or attacks, both processing and performing
2. Enemies process their turns, create a "moving" and "attacking" queue
3. Attacking enemies perform turns first
4. Moving enemies act
5. When both queues are empty, player turn starts again

Processing a turn means checking to see if the entity is moving or attacking, and then adding itself to the appropriate queue. Performing is acting out that turn.

TODO: Enemies are trying to move into their own target cells. Probably should have an "owner" check of some kind. After that, I think we can clean up console.logs.

*/
