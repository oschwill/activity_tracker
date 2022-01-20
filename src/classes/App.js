export default class App {
  /* private properties */
  #map;
  #mapEvent;
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

  _toggleElevationField() {}

  _newWorkout(e) {
    // const validInputs = (...inputs) => inputs.every((inp) => Number.isFinite(inp) || inp <= 0);

    e.preventDefault();

    // Wir holen uns die Form Daten
    const type = this.inputType.value;
    const distance = +this.inputDistance.value; // Number
    const duration = +this.inputDuration.value; // Number

    // Wir checken auf welchen type
    switch (type) {
      case 'running':
        console.log(type);
        const cadence = +this.inputCadence.value; // Number

        // Checken ob distance eine endliche Number ist und größer 0
        if (!Number.isFinite(distance) || distance <= 0)
          return alert('DISTANZ: Bitte geben Sie eine positive Zahl ein!');
        // Checken ob duration eine endliche Number ist und größer 0
        if (!Number.isFinite(duration) || duration <= 0)
          return alert('DAUER: Bitte geben Sie eine positive Zahl ein!');
        // Checken ob cadence eine endliche Number ist und größer 0
        if (!Number.isFinite(cadence) || cadence <= 0)
          return alert('KADENZ: Bitte geben Sie eine positive Zahl ein!');

        break;
      case 'cycling':
        const elevation = +this.inputElevation.value; // Number
        break;

      default:
        alert('Fehler bei der Type Übergabe!');
        break;
    }

    // Input Felder clearen
    this.inputDistance.value =
      this.inputDuration.value =
      this.inputCadence.value =
      this.inputElevation.value =
        '';

    // Marker und popup erstellen
    const { lat, lng } = this.#mapEvent.latlng;
    L.marker([lat, lng])
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: 'running-popup',
        })
      )
      .setPopupContent('Workout')
      .openPopup();
  }

  _changeType() {
    this.inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
    this.inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
  }
}
