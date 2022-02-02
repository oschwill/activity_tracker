export default class AlertBox {
  /*
  @ Oliver Schwill

  type: warning | error | success  <= Farben gelb, rot, grün
  animation: slidein, slideup, slidedown, zoom
  animDuration: 100 - 3000 ms
  position: top | bottom
  text: write your message
  vanish: true | false
  vanishTime: 5 - 15 sec
*/
  /* public properties */
  box;
  closeButton;
  paragraph;
  timer;
  static animateFrom = {
    slideIn: { left: '-150%' },
    slideUp: { top: '150%' },
    slideDown: { top: '-50%' },
    zoom: { transform: 'scale(0)' },
  };
  static animateTo = {
    slideIn: { left: '0%' },
    slideUp: { top: '0%' },
    slideDown: { top: '100%' },
    zoom: { transform: 'scale(1)' },
  };
  static close = 'close';
  static warning = ['alertbox', 'alertbox__warning'];
  static error = ['alertbox', 'alertbox__error'];
  static success = ['alertbox', 'alertbox__success'];

  static createBox(inputs) {
    // checken ob die Box schon kreiert ist um den Timer zu löschen
    this.clearBox();

    // Box kreieren
    this.box = document.createElement('div');

    this.paragraph = document.createElement('p');

    // Text setzen
    this.paragraph.innerHTML = inputs.text;

    // Den Type checken ob warn, error oder success box
    this.checkType(inputs.type);

    // Position setzten
    this.setPosition(inputs.position);

    // Die Box anhängen
    this.setBox();

    // Set Animation
    this.setAnimation(inputs.animation, inputs.animDuration);

    // Eventlistener
    this.createEventListener();

    // vanish the box?
    this.setVanishTimer(inputs.vanish, inputs.vanishTimer);
  }

  static clearBox() {
    const el = document.getElementsByClassName('alertbox').length;
    if (el > 0 && typeof this.box !== 'undefined') {
      clearTimeout(this.timer);
      document.body.removeChild(this.box);
    }
  }

  static checkType(type) {
    switch (type) {
      case 'warning':
        this.box.classList.add(...this.warning);
        break;
      case 'error':
        this.box.classList.add(...this.error);
        break;
      case 'success':
        this.box.classList.add(...this.success);
        break;
      default:
        throw new TypeError(`invalid type name: ${type}`);
    }
  }

  static setBox() {
    this.closeButton = document.createElement('div');
    this.closeButton.classList.add(this.close);
    this.box.append(this.closeButton, this.paragraph);
    document.body.appendChild(this.box);
  }

  static setAnimation(animation, animDuration = 1000) {
    if (animDuration >= 100 && animDuration <= 3000) {
      // refactor
      if (this.animateFrom.hasOwnProperty(animation)) {
        this.box.animate([this.animateFrom[animation], this.animateTo[animation]], {
          duration: animDuration,
        });
      } else {
        throw new TypeError(`invalid animation name: ${animation}`);
      }
    } else {
      throw new RangeError(`invalid range of animDuration: need between 100 and 3000 ms`);
    }
  }

  static setPosition(position) {
    position === 'bottom'
      ? (this.box.style.bottom = '0')
      : position === 'top'
      ? (this.box.style.top = '0')
      : (function () {
          throw new TypeError(`invalid position name: ${position}`);
        })();
  }

  static setVanishTimer(vanish, vanishTimer) {
    if (vanish === true) {
      if (vanishTimer >= 5 && vanishTimer <= 15) {
        this.timer = setTimeout(() => {
          document.body.removeChild(this.box);
        }, vanishTimer * 1000);
      } else {
        throw new Error('invalid vanish time: 5 to 15 seconds');
      }
    } else {
      console.log(this.vanished);
    }
  }

  static createEventListener() {
    this.closeButton.addEventListener('click', () => {
      document.body.removeChild(this.box);
      clearTimeout(this.timer);
    });
  }
}
