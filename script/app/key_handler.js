define(function (require) {
  console.log("key handler loaded");

  var KeyCodes = {
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    SPACE: 32,
    Q_KEY: 81,
    E_KEY: 69
  };

  var KeyCodeMap = [];
  KeyCodeMap[KeyCodes.LEFT] = 0;
  KeyCodeMap[KeyCodes.UP] = 1;
  KeyCodeMap[KeyCodes.RIGHT] = 2;
  KeyCodeMap[KeyCodes.DOWN] = 3;
  KeyCodeMap[KeyCodes.SPACE] = 4;
  KeyCodeMap[KeyCodes.Q_KEY] = 5;
  KeyCodeMap[KeyCodes.E_KEY] = 6;

  var key_pressed = [false, false, false, false, false, false, false];

  document.addEventListener("keydown", function(event) {
    updateKeysPressed(event, true);

    return key_pressed;
  });

  document.addEventListener("keyup", function(event) {
    updateKeysPressed(event, false);

    return key_pressed;
  });

  function updateKeysPressed(event, pressed) {
    if (KeyCodeMap[event.keyCode] != undefined) {
      key_pressed[KeyCodeMap[event.keyCode]] = pressed;
      event.preventDefault();
    }
  }

  return { pressed: key_pressed };
});
