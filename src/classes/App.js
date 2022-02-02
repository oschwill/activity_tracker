/* API */
import L from 'leaflet';
/* CLASSES */
import Cycling from './Cycling';
import Running from './Running';
import AlertBox from './AlertBox';
// images
import logo from '../images/logo.png';

export default class App {
  /* private properties */
  #map;
  #mapZoomLevel = 13;
  #mapEvent;
  #workouts = [];
  #preWorkout;
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
    // Wir resetten die select option
    this.inputType.selectedIndex = 0;
    // Map Laden und Position ermitteln
    this._getPosition();
    // Bilder laden
    this.sidebar.insertAdjacentHTML('afterbegin', `<img src="${logo}" alt="Logo" class="logo" />`);

    // Daten aus dem Local Storage laden und bereits vorhandene Marker setzten
    this._getLocalStorage();
    // Event Listener für die Form erzeugen und this keyword an app binden
    this.form.addEventListener('submit', this._newWorkout.bind(this));
    // Eventlistener für den type change erzeugen
    this.inputType.addEventListener('change', this._changeType.bind(this));
    // Eventlistener um zu dem marker zu moven bei klicken auf das erstellte Event
    this.containerWorkouts.addEventListener('click', this._moveToPopup.bind(this));
    // Eventlistener um alle workouts zu löschen!
    this.button.addEventListener('click', this._resetLocalStorage);
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
    this.button = document.querySelector('.delete__button');
  }

  _getPosition() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this._loadMap.bind(this), function () {
        AlertBox.createBox({
          type: 'error',
          position: 'top',
          animation: 'zoom',
          animDuration: 500,
          text: 'Konnte die Position nicht lokalisieren',
          vanish: true,
          vanishTimer: 10,
        });
      });
    }
  }

  _loadMap(position) {
    const { latitude, longitude } = position.coords;

    this.#map = L.map('map').setView([latitude, longitude], this.#mapZoomLevel);

    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    // Klick auf die Map
    this.#map.on('click', this._showForm.bind(this));

    // Wir laden die marker aus dem localstorage
    this.#workouts.forEach((work) => {
      this._renderWorkoutMarker(work);
    });
    // Nach Laden der Seite checlen ob elemente existieren dann delete Button laden
    if (this.#workouts.length > 0) {
      this._setDeleteButton();
    }
  }

  _setDeleteButton() {
    if (this.#workouts.length > 0) {
      this.button.classList.toggle('delete__button--hidden');
    }
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
          return AlertBox.createBox({
            type: 'error',
            position: 'top',
            animation: 'slideIn',
            animDuration: 500,
            text: 'Bitte geben Sie nur positive Zahlen ein!',
            vanish: true,
            vanishTimer: 7,
          });

        // Das Popup für den marker erstellen und an das Object binden
        let popup = this._createPopup(type);
        // Neues Running Workout Object erstellen
        workout = new Running([lat, lng], distance, duration, popup, cadence);
        break;
      case 'cycling':
        const elevation = +this.inputElevation.value; // Number
        // Checken ob distance, duration, eine endliche Number ist und größer 0
        if (!validPositiveInputs(distance, duration, elevation) || !allPositive(distance, duration))
          return AlertBox.createBox({
            type: 'error',
            position: 'top',
            animation: 'slideIn',
            animDuration: 500,
            text: 'Bitte geben Sie nur positive Zahlen ein!',
            vanish: true,
            vanishTimer: 7,
          });

        // Das Popup für den marker erstellen und an das Object binden
        popup = this._createPopup(type);
        // Neues Cycling Workout Object erstellen
        workout = new Cycling([lat, lng], distance, duration, popup, elevation);
        break;

      default:
        AlertBox.createBox({
          type: 'error',
          position: 'top',
          animation: 'slideIn',
          animDuration: 500,
          text: 'Fehler bei der Type Übergabe!',
          vanish: true,
          vanishTimer: 7,
        });
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

    // Local Storage einrichten
    this._setLocalStorage();

    // Save Message
    AlertBox.createBox({
      type: 'success',
      position: 'top',
      animation: 'slideUp',
      animDuration: 500,
      text: 'Workout erfolgreich gespeichert!',
      vanish: true,
      vanishTimer: 7,
    });

    // set deleteAll Button
    if (this.button.classList.contains('delete__button--hidden')) {
      this._setDeleteButton();
    }
  }

  _createPopup(type) {
    return L.popup({
      maxWidth: 250,
      minWidth: 100,
      autoClose: false,
      closeOnClick: false,
      className: `${type}-popup`,
    });
  }

  _renderWorkoutMarker(workout) {
    L.marker(workout.coords)
      .addTo(this.#map)
      .bindPopup(workout.popup)
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

  _moveToPopup(e) {
    // Falls bereits auf ein Workput geklcikt wurde, resetten wir das Popup
    if (this.#preWorkout) this.#preWorkout.popup._container.firstChild.style.transform = 'scale(1)';

    const workoutEl = e.target.closest('.workout');

    if (!workoutEl) return;

    const workout = this.#workouts.find((work) => work.getId === workoutEl.dataset.id);

    // Bei Klick auf das Workout popup vergrößern
    workout.popup._container.firstChild.style.transform = 'scale(1.15)';

    // Workout object via reference an private property binden
    this.#preWorkout = workout;

    // Wir setzen die view auf die koordinaten des geklickten Workputs
    this.#map.setView(workout.coords, this.#mapZoomLevel, {
      animate: true,
      pan: {
        duration: 1,
      },
    });

    // Wir zählen die Klicks
    workout._click();
  }

  _setLocalStorage() {
    localStorage.setItem('workouts', JSON.stringify(this.#workouts, this.getCircularReplacer()));
  }

  getCircularReplacer = () => {
    const seen = new WeakSet();
    return (key, value) => {
      if (typeof value === 'object' && value !== null) {
        if (seen.has(value)) {
          return;
        }
        seen.add(value);
      }
      return value;
    };
  };

  _getLocalStorage() {
    const data = JSON.parse(localStorage.getItem('workouts'));

    if (!data) return;

    this.#workouts = data.map((obj) => {
      let popup = this._createPopup(obj.type);

      if (obj.type == 'running') {
        return new Running(obj.coords, obj.distance, obj.duration, popup, obj.cadence);
      }
      if (obj.type == 'cycling') {
        return new Cycling(obj.coords, obj.distance, obj.duration, popup, obj.elevationGain);
      }
    });

    this.#workouts.forEach((work) => {
      this._renderWorkout(work);
    });
  }

  _resetLocalStorage() {
    localStorage.removeItem('workouts');
    location.reload();
  }
}
