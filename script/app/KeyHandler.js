define(function (require) {
  "use strict";

  KeyHandler.KeyCodes = {
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    SPACE: 32,
    Q_KEY: 81,
    E_KEY: 69
  };

  KeyHandler.KeyCodeMap = [];
  KeyHandler.KeyCodeMap[KeyHandler.KeyCodes.LEFT] = 0;
  KeyHandler.KeyCodeMap[KeyHandler.KeyCodes.UP] = 1;
  KeyHandler.KeyCodeMap[KeyHandler.KeyCodes.RIGHT] = 2;
  KeyHandler.KeyCodeMap[KeyHandler.KeyCodes.DOWN] = 3;
  KeyHandler.KeyCodeMap[KeyHandler.KeyCodes.SPACE] = 4;
  KeyHandler.KeyCodeMap[KeyHandler.KeyCodes.Q_KEY] = 5;
  KeyHandler.KeyCodeMap[KeyHandler.KeyCodes.E_KEY] = 6;

  function KeyHandler(scope) {
    this.scope = scope;
    this.key_pressed = [false, false, false, false, false, false, false];

    scope.addEventListener("keydown", function(event) {
      this.updateKeysPressed(event, true);
    }.bind(this));

    scope.addEventListener("keyup", function(event) {
      this.updateKeysPressed(event, false);
    }.bind(this));
  }

  KeyHandler.prototype = {
    constructor: KeyHandler,

    updateKeysPressed: function(event, pressed) {
      if (KeyHandler.KeyCodeMap[event.keyCode] !== undefined) {
        this.key_pressed[KeyHandler.KeyCodeMap[event.keyCode]] = pressed;
        event.preventDefault();
      }
    },

    pressing: function(keycode) {
      return (this.key_pressed[KeyHandler.KeyCodeMap[keycode]]);
    }
  };

  return KeyHandler;
});
