document.addEventListener('DOMContentLoaded', loaded, false);

var car_array = [];

var KeyCodes = {
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
  SPACE: 32
};

var KeyCodeMap = [];
KeyCodeMap[KeyCodes.LEFT] = 0;
KeyCodeMap[KeyCodes.UP] = 1;
KeyCodeMap[KeyCodes.RIGHT] = 2;
KeyCodeMap[KeyCodes.DOWN] = 3;
KeyCodeMap[KeyCodes.SPACE] = 4;

var key_pressed = [false, false, false, false, false];

document.addEventListener("keydown", function(event) {
  updateKeysPressed(event, true);
});

document.addEventListener("keyup", function(event) {
  updateKeysPressed(event, false);
});

function updateKeysPressed(event, pressed) {
  if (KeyCodeMap[event.keyCode] != undefined) {
    key_pressed[KeyCodeMap[event.keyCode]] = pressed;
    event.preventDefault();
  }
}

var FRONT_STEERING_MODE = 0, REAR_STEERING_MODE = 1, DUAL_STEERING_MODE = 2;

var wheel_width = 5, wheel_length = 11;
var car_width = 21, car_height = 25;
var wheel_base = car_height + wheel_length / 4;

function pressing(keycode) {
  return (key_pressed[KeyCodeMap[keycode]]);
}

var still_counter = 0;

function process() {
  var local_car = getLocalPlayer();

  if (local_car == undefined) {
    return;
  }

  if (pressing(KeyCodes.UP)) {
    if (local_car.speed + 0.5 < 4.0) {
      local_car.speed += 0.3;
    } else {
      local_car.speed = 4.0;
    }
  }

  if (pressing(KeyCodes.DOWN)) {
    if (local_car.speed > 0.5) {
      local_car.speed *= 0.8;
    } else if (local_car.speed <= 0.5 && local_car.speed > 0.1) {
      local_car.speed *= 0.6;
    } else {
      local_car.speed = 0.0;
    }
  }

  if (pressing(KeyCodes.LEFT)) {
    turnWheelLeft(local_car);
  }
  if (pressing(KeyCodes.RIGHT)) {
    turnWheelRight(local_car);
  }

  _.forEach(car_array, function(car) {
    calculateRotationRad(car);
    calculateFrontWheel(car);
    calculateBackWheel(car);

    // Calculate all cars movements locally to prevent jumpiness.
    moveCar(car);
  });

  draw();
}

function calculateRotationRad(car) {
  car.position.rotation.car_rad = (car.position.rotation.car_deg - 90) * (Math.PI/180);
}

function getPositionRotationRad(car) {
  return (car.position.rotation.car_deg) * (Math.PI/180);
}

function moveCar(car) {
  var wheel_rotation_rad = (car.position.rotation.wheel_deg - 90) * (Math.PI / 180);

  var dt = 1;

  var front_modifier = 0;
  var back_modifier = 0;

  if (car.steering_mode === REAR_STEERING_MODE) {
    // If the car is using rear steering mode then the back modifier is the one that has the wheel rotation applied
    front_modifier = car.position.rotation.car_rad;
    back_modifier = (car.position.rotation.car_rad + wheel_rotation_rad);
  } else if (car.steering_mode === FRONT_STEERING_MODE) {
    front_modifier = (car.position.rotation.car_rad + wheel_rotation_rad);
    back_modifier = car.position.rotation.car_rad;
  } else if (car.steering_mode === DUAL_STEERING_MODE) {
    front_modifier = (car.position.rotation.car_rad + wheel_rotation_rad);
    back_modifier = car.position.rotation.car_rad + ((getBackWheelRotationDegrees(car) - 90) * (Math.PI / 180));
  }

  car.position.wheels.front.x += car.speed * dt * Math.cos(front_modifier);
  car.position.wheels.front.y += car.speed * dt * Math.sin(front_modifier);

  car.position.wheels.back.x += car.speed * dt * Math.cos(back_modifier);
  car.position.wheels.back.y += car.speed * dt * Math.sin(back_modifier);

  car.position.x = (car.position.wheels.front.x + car.position.wheels.back.x) / 2;
  car.position.y = (car.position.wheels.front.y + car.position.wheels.back.y) / 2;

  car.position.rotation.car_deg = (Math.atan2( car.position.wheels.front.y - car.position.wheels.back.y , car.position.wheels.front.x - car.position.wheels.back.x ) * (180/Math.PI)) + 90;
}

function turnWheelRight(car) {
  setWheelRotation(car, car.position.rotation.wheel_deg + 5);
  return;
}

function turnWheelLeft(car) {
  setWheelRotation(car, car.position.rotation.wheel_deg - 5);
  return;
}

// Default is 40 deg left, 140 deg right.
var LEFT_TURN_MAX = 40, RIGHT_TURN_MAX = 140;

function setWheelRotation(car, value) {
  if (value <= LEFT_TURN_MAX) {
    return;
  }
  if (value >= RIGHT_TURN_MAX) {
    return;
  }

  car.position.rotation.wheel_deg = value;
  return;
}

var CAR_CENTER_CANVAS = true;

function draw() {
  var canvas = document.getElementById('wheels');
  var ctx = canvas.getContext('2d');
  ctx.font = "12px Arial";

  var local_car_x = getLocalPlayer().position.x;
  var local_car_y = getLocalPlayer().position.y;

  var origin_x = canvas.width / 2;
  var origin_y = canvas.height / 2;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  _.forEach(car_array, function(car) {
    drawCar(car);
  });

  ctx.fillText("x: " + getLocalPlayer().position.x.toFixed(2) + ", y: " + getLocalPlayer().position.y.toFixed(2), 25, 25);

  function drawCar(car) {
    // http://engineeringdotnet.blogspot.co.uk/2010/04/simple-2d-car-physics-in-games.html

    var car_pos_x = 0;
    var car_pos_y = 0;

    if (CAR_CENTER_CANVAS) {
      car_pos_x = car.position.x - local_car_x + origin_x;
      car_pos_y = car.position.y - local_car_y + origin_y;
    }

    ctx.save();

    ctx.translate(car_pos_x, car_pos_y);
    ctx.rotate(getPositionRotationRad(car));
    ctx.translate(-(car_pos_x), -(car_pos_y));

    var front_left_wheel_x = (car_pos_x - car_width + wheel_width);
    var front_left_wheel_y = (car_pos_y - car_height + wheel_length) - 1;

    var front_right_wheel_x = front_left_wheel_x + car_width;
    var front_right_wheel_y = front_left_wheel_y;

    var back_left_wheel_x = (car_pos_x - car_width + wheel_width);
    var back_left_wheel_y = (car_pos_y + wheel_length) - 1;

    var back_right_wheel_x = back_left_wheel_x + car_width;
    var back_right_wheel_y = back_left_wheel_y;

    var front_wheel_rotation = 90;
    var back_wheel_rotation = 90;

    if (car.steering_mode === REAR_STEERING_MODE) {
      front_wheel_rotation = 90;
      back_wheel_rotation = car.position.rotation.wheel_deg;
    } else if (car.steering_mode === FRONT_STEERING_MODE) {
      front_wheel_rotation = car.position.rotation.wheel_deg;
      back_wheel_rotation = 90;
    } else if (car.steering_mode === DUAL_STEERING_MODE) {
      front_wheel_rotation = car.position.rotation.wheel_deg;
      back_wheel_rotation = getBackWheelRotationDegrees(car);
    }

    drawRotatedRect(front_left_wheel_x, front_left_wheel_y, wheel_length, wheel_width, front_wheel_rotation);
    drawRotatedRect(front_right_wheel_x, front_right_wheel_y, wheel_length, wheel_width, front_wheel_rotation);

    drawRotatedRect(back_left_wheel_x, back_left_wheel_y, wheel_length, wheel_width, back_wheel_rotation);
    drawRotatedRect(back_right_wheel_x, back_right_wheel_y, wheel_length, wheel_width, back_wheel_rotation);

    ctx.save();
    ctx.fillStyle = "#" + car.color;
    ctx.fillRect(car_pos_x - (car_width * 0.55), car_pos_y - (car_height * 0.60), car_width * 1.10, car_height * 1.20);
    ctx.restore();

    ctx.restore();
  }

  function drawRotatedRect(x, y, width, height, rotation) {
    ctx.save();
    ctx.translate(x + width / 2, y + height / 2);
    ctx.rotate(rotation * Math.PI / 180);
    ctx.fillRect(-width / 2, -height / 2, width, height);
    ctx.restore();
  }
}

function getBackWheelRotationDegrees(car) {
  var rotation = car.position.rotation.wheel_deg;

  return (rotation - 2 * (rotation - 90));
}

function calculateFrontWheel(car) {
  car.position.wheels.front.x = car.position.x + wheel_base/2 * Math.cos(car.position.rotation.car_rad);
  car.position.wheels.front.y = car.position.y + wheel_base/2 * Math.sin(car.position.rotation.car_rad);
}

function calculateBackWheel(car) {
  car.position.wheels.back.x = car.position.x - wheel_base/2 * Math.cos(car.position.rotation.car_rad);
  car.position.wheels.back.y = car.position.y - wheel_base/2 * Math.sin(car.position.rotation.car_rad);
}

var socket = io({reconnection: false});

socket.on("player join", function(player_data) {
  car_array.push(player_data);
});

socket.on("player leave", function(player_id) {
  var slot = -1;

  for (var i = 0; i < car_array.length; i++) {
    if (car_array[i] == null) {
      continue;
    }

    if (car_array[i].id === player_id) {
      slot = i;
      break;
    }
  }

  if (slot != -1) {
    car_array.splice(slot, 1);
  }
});

socket.on("player update", function(player_data) {
  console.log(car_array.length);

  for (var i = 0; i < car_array.length; i++) {
    if (car_array[i] == null) {
      continue;
    }

    if (car_array[i].id == player_data.id) {
      car_array[i] = player_data;
      return;
    }
  }
});

/*
 * The local player is always sent first, so it will
 * always be in the first array slot.
 */

function getLocalPlayer() {
  return car_array[0];
}

function updatePlayer() {
  socket.emit("update player", getLocalPlayer());
}

function loaded() {
  setInterval(function() { process(); }, 25);

  setInterval(function() { updatePlayer(); }, 100);
}
