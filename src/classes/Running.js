/* CLASSES */
import Workout from './Workout';

export default class Running extends Workout {
  /* private properties */
  #pace;
  /* public properties */
  cadence;
  type = 'running';

  /* GETTER */
  get getPace() {
    this.#pace = this.duration / this.distance; // Tempo ausrechnen
    return this.#pace;
  }

  /* KONSTRUKTOR */
  constructor(coords, distance, duration, popup, cadence) {
    // Parent Kontruktor aufrufen
    super(coords, distance, duration, popup);
    // Wert setzten
    this.cadence = cadence;
    this._setDescription();
  }
}
