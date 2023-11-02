window.addEventListener('keyup', function (event) { Key.onKeyup(event); }, false);
window.addEventListener('keydown', function (event) { Key.onKeydown(event); }, false);

var Key = {
  _pressed: {},

  L: 37,
  U: 38,
  R: 39,
  S: 83,
  D: 40,
  M: 77,
  SPACE: 32,

  isDown: function (keyCode) {
    return this._pressed[keyCode];
  },

  onKeydown: function (event) {
    this._pressed[event.keyCode] = true;
  },

  onKeyup: function (event) {
    delete this._pressed[event.keyCode];
  }
};

window.addEventListener('keypress', function (e) {
  if (begin) {
    if (e.keyCode = "32") {
      gamePlay();
      begin = false;
    }
  }
});


