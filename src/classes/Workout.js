export default class Workout {
  /* private properties */
  #date = new Date();
  #id = (Date.now() + '').slice(-10); // letzten 10 Ziffern
  // prettier-ignore
  #months = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 
  'September', 'Oktober', 'November', 'Dezember'];
  /* public properties */
  coords;
  distance;
  duration;
  description;

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

  _setDescription() {
    this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} 
    am ${this.#date.getDate()} ${this.#months[this.#date.getMonth()]}`;

    console.log(this.description);
  }
}
