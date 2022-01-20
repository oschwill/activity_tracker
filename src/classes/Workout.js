export default class Workout {
  /* private properties */
  #date = new Date();
  #id = (Date.now() + '').slice(-10); // letzten 10 Ziffern
  /* public properties */
  coords;
  distance;
  duration;

  /* GETTER */
  get getId() {
    return this.#id;
  }

  get getDate() {
    return this.#date;
  }

  /* KONSTRUKTOR */
  constructor(coords, distance, duration) {
    // Wert setzten
    this.coords = coords;
    this.distance = distance;
    this.duration = duration;
  }
}
