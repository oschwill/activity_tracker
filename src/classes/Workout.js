export default class Workout {
  /* private properties */
  #date = new Date();
  #id = (Date.now() + '').slice(-10); // letzten 10 Ziffern
  #clicks = 0;
  // prettier-ignore
  #months = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 
  'September', 'Oktober', 'November', 'Dezember'];
  /* public properties */
  coords;
  distance;
  duration;
  description;
  popup;

  /* GETTER */
  get getId() {
    return this.#id;
  }

  get getDate() {
    return this.#date;
  }

  /* KONSTRUKTOR */
  constructor(coords, distance, duration, popup) {
    // Wert setzten
    this.coords = coords;
    this.distance = distance;
    this.duration = duration;
    this.popup = popup;
  }

  _setDescription() {
    this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} 
    am ${this.#date.getDate()} ${this.#months[this.#date.getMonth()]}`;
  }

  _click() {
    this.#clicks++;
  }
}
