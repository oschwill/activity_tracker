/* CLASSES */
import Cycling from './Cycling';
import Running from './Running';

export default class App {
  /* private properties */
  #map;
  #mapEvent;
  #workouts = [];
  /* public properties */
  sidebar;
  form;
  containerWorkouts;
  inputType;
  inputDistance;
  inputDuration;
  inputCadence;
  inputElevation;

  /* KONSTRUKTOR */
  constructor() {
    // Alle Dom Elemente definieren
    this._defineElements();
    // Map Laden und Position ermitteln
    this._getPosition();
    // Event Listener für die Form erzeugen und this keyword an app binden
    this.form.addEventListener('submit', this._newWorkout.bind(this));
    // Eventlistener für den type change erzeugen
    this.inputType.addEventListener('change', this._changeType.bind(this));
  }

  /* METHODS */
  _defineElements() {
    this.sidebar = document.querySelector('.sidebar');
    this.form = document.querySelector('.form');
    this.containerWorkouts = document.querySelector('.workouts');
    this.inputType = document.querySelector('.form__input--type');
    this.inputDistance = document.querySelector('.form__input--distance');
    this.inputDuration = document.querySelector('.form__input--duration');
    this.inputCadence = document.querySelector('.form__input--cadence');
    this.inputElevation = document.querySelector('.form__input--elevation');
  }

  _getPosition() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this._loadMap.bind(this), function () {
        alert('Konnte die Position nicht lokalisieren');
      });
    }
  }

  _loadMap(position) {
    const { latitude, longitude } = position.coords;

    this.#map = L.map('map').setView([latitude, longitude], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    // Klick auf die Map
    this.#map.on('click', this._showForm.bind(this));
  }

  _showForm(mapE) {
    this.#mapEvent = mapE;
    this.form.classList.remove('hidden');
    this.inputDistance.focus();
  }

  _hideForm() {
    // Empty inputs
    this.inputDistance.value =
      this.inputDuration.value =
      this.inputCadence.value =
      this.inputElevation.value =
        '';

    this.form.style.display = 'none';
    this.form.classList.add('hidden');
    setTimeout(() => (this.form.style.display = 'grid')), 1000;
  }

  _toggleElevationField() {}

  _newWorkout(e) {
    /* Helper functions */
    const validPositiveInputs = (...inputs) => inputs.every((inp) => Number.isFinite(inp));
    const allPositive = (...inputs) => inputs.every((inp) => inp >= 1);

    e.preventDefault();

    // Wir holen uns die Form Daten
    const type = this.inputType.value;
    const distance = +this.inputDistance.value; // Number
    const duration = +this.inputDuration.value; // Number
    const { lat, lng } = this.#mapEvent.latlng; // lattitude und longitude holen
    let workout;

    // Wir checken auf welchen type
    switch (type) {
      case 'running':
        const cadence = +this.inputCadence.value; // Number
        // Checken ob distance, duration, cadence eine endliche Number ist und größer 0
        if (
          !validPositiveInputs(distance, duration, cadence) ||
          !allPositive(distance, duration, cadence)
        )
          return alert('RUNNING: Bitte geben Sie nur positive Zahlen ein!');

        // Neues Running Workout Object erstellen
        workout = new Running([lat, lng], distance, duration, cadence);
        break;
      case 'cycling':
        const elevation = +this.inputElevation.value; // Number
        // Checken ob distance, duration, eine endliche Number ist und größer 0
        if (!validPositiveInputs(distance, duration, elevation) || !allPositive(distance, duration))
          return alert('Bitte geben Sie nur positive Zahlen ein!');

        // Neues Cycling Workout Object erstellen
        workout = new Cycling([lat, lng], distance, duration, elevation);
        break;

      default:
        alert('Fehler bei der Type Übergabe!');
        break;
    }

    // ins workouts array pushen
    this.#workouts.push(workout);

    // Marker und popup erstellen
    this._renderWorkoutMarker(workout);

    // Workout container rendern
    this._renderWorkout(workout);
    // Input Felder clearen und From hiden
    this._hideForm();
  }

  _renderWorkoutMarker(workout) {
    L.marker(workout.coords)
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: `${workout.type}-popup`,
        })
      )
      .setPopupContent(`${workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'} ${workout.description}`)
      .openPopup();
  }

  _renderWorkout(workout) {
    const html = `
    <li class="workout workout--${workout.type}" data-id="${workout.getId}">
        <h2 class="workout__title">${workout.description}</h2>
        <div class="workout__details">
          <span class="workout__icon">${workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'}</span>
          <span class="workout__value">${workout.distance}</span>
          <span class="workout__unit">km</span>
        </div>
        <div class="workout__details">
          <span class="workout__icon">⏱</span>
          <span class="workout__value">${workout.duration}</span>
          <span class="workout__unit">min</span>
        </div>
        ${
          workout.type === 'running'
            ? `
          <div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">${workout.getPace}</span>
            <span class="workout__unit">min/km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">🦶🏼</span>
            <span class="workout__value">${workout.cadence}</span>
            <span class="workout__unit">spm</span>
          </div>        
          `
            : `  
          <div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">${workout.getSpeed}</span>
            <span class="workout__unit">km/h</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⛰</span>
            <span class="workout__value">${workout.elevationGain}</span>
            <span class="workout__unit">m</span>
          </div>
          `
        }
    </li>
    `;

    this.form.insertAdjacentHTML('afterend', html);
  }

  _changeType() {
    this.inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
    this.inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
  }
}
