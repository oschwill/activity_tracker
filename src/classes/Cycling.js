/* CLASSES */
import Workout from './Workout';

export default class Cycling extends Workout {
  /* public properties */
  elevationGain;
  speed;

  /* KONSTRUKTOR */
  constructor(coords, distance, duration, elevationGain) {
    super(coords, distance, duration); // Parent Kontruktor aufrufen
    this.elevationGain = elevationGain;
    // Geschwindigkeit in Stunden ausrechnen
    this.calcSpeed(); // # return Wert wird noch nicht benötigt
  }

  calcSpeed() {
    this.speed = this.distance / (this.duration / 60);
    return this.speed;
  }
}
