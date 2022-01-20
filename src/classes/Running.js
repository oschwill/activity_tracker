/* CLASSES */
import Workout from './Workout';

export default class Running extends Workout {
  /* public properties */
  cadence;

  /* KONSTRUKTOR */
  constructor(coords, distance, duration, cadence) {
    // Parent Kontruktor aufrufen
    super(coords, distance, duration);
    // Wert setzten
    this.cadence = cadence;
    // Tempo berechnen
    this.calcPace();
  }

  calcPace() {
    this.pace = this.duration / this.distance; // Tempo ausrechnen
    return this.pace;
  }
}
