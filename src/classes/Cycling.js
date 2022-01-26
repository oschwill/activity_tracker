/* CLASSES */
import Workout from './Workout';

export default class Cycling extends Workout {
  /* private properties */
  #speed;
  /* public properties */
  elevationGain;
  type = 'cycling';

  /* GETTER */
  get getSpeed() {
    // Geschwindigkeit ausrechnen
    this.#speed = this.distance / (this.duration / 60);
    return this.#speed;
  }

  /* KONSTRUKTOR */
  constructor(coords, distance, duration, popup, elevationGain) {
    super(coords, distance, duration, popup); // Parent Kontruktor aufrufen
    this.elevationGain = elevationGain;
    // Geschwindigkeit in Stunden ausrechnen
    this._setDescription();
  }
}
