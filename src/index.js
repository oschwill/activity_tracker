/* API */
import L from 'leaflet';
/* CLASSES */
import App from './classes/App';
import Running from './classes/Running';
import Cycling from './classes/Cycling';

/* CSS */
import './styles/style.css';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// const sidebar = document.querySelector('.sidebar');
// const form = document.querySelector('.form');
// const containerWorkouts = document.querySelector('.workouts');
// const inputType = document.querySelector('.form__input--type');
// const inputDistance = document.querySelector('.form__input--distance');
// const inputDuration = document.querySelector('.form__input--duration');
// const inputCadence = document.querySelector('.form__input--cadence');
// const inputElevation = document.querySelector('.form__input--elevation');

// Seiten aufbau
const app = new App();

// Running Workput erstellen => Beispiel
const run1 = new Running([39, -12], 5.2, 24, 178);
const cycle1 = new Cycling([39, -12], 27, 95, 523);
