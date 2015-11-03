(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

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

var scale = 1.4;

var wheel_width = 5 * scale, wheel_length = 11 * scale;
var car_width = 21 * scale, car_height = 25 * scale;
var wheel_base = car_height + wheel_length / 4;

function pressing(keycode) {
  return (key_pressed[KeyCodeMap[keycode]]);
}

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

  if (pressing(KeyCodes.LEFT) != true && pressing(KeyCodes.RIGHT) != true) {
    straightenWheel(local_car);
  }

  _.forEach(car_array, function(car) {
    if (car != undefined) {
      calculateRotationRad(car);
      calculateFrontWheel(car);
      calculateBackWheel(car);

      // Calculate all cars movements locally to prevent jumpiness.
      moveCar(car);
    }
  });
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

var WHEEL_TURN_INCREMENT = 2.5, WHEEL_STRAIGHTEN_INCREMENT = 4.0;

function turnWheelRight(car) {
  setWheelRotation(car, car.position.rotation.wheel_deg + WHEEL_TURN_INCREMENT);
  return;
}

function turnWheelLeft(car) {
  setWheelRotation(car, car.position.rotation.wheel_deg - WHEEL_TURN_INCREMENT);
  return;
}

function straightenWheel(car) {
  var original_rotation = car.position.rotation.wheel_deg;

  var new_rotation;

  if (original_rotation > 90.0) {
    var delta = (original_rotation - 90.0);

    if (delta <= WHEEL_STRAIGHTEN_INCREMENT) {
      new_rotation = 90.0;
    } else {
      new_rotation = (original_rotation - WHEEL_STRAIGHTEN_INCREMENT);
    }
  } else {
    var delta = (90.0 - original_rotation);

    if (delta <= WHEEL_STRAIGHTEN_INCREMENT) {
      new_rotation = 90.0;
    } else {
      new_rotation = (original_rotation + WHEEL_STRAIGHTEN_INCREMENT);
    }
  }

  setWheelRotation(car, new_rotation);
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

var PRELOAD_VEHICLE_MODEL_COUNT = 5, PRELOAD_VEHICLE_COLOR_COUNT = 5;

var vehicle_images = new Array();

function getVehicleImage(id, color) {
  return loadVehicleImage(id, color);
}

function loadVehicleImages() {
  for (var m = 0; m < PRELOAD_VEHICLE_MODEL_COUNT; m++) {
    vehicle_images[m] = new Array();

    for (var c = 0; c < PRELOAD_VEHICLE_COLOR_COUNT; c++) {
      vehicle_images[m][c] = new Image();
      vehicle_images[m][c].src = getVehicleImageSrc(m, c);
    }
  }
}

function getVehicleImageSrc(model, color) {
  return ('/assets/vehicles/' + model + '_' + color + '.png');
}

function loadVehicleImage(model, color) {
  if (vehicle_images[model] == undefined) {
    vehicle_images[model] = new Array();
  }

  vehicle_images[model][color] = new Image();
  vehicle_images[model][color].src = getVehicleImageSrc(model, color);

  return vehicle_images[model][color];
}

var LOWEST_TRACK_TILE_ID = 0, HIGHEST_TRACK_TILE_ID = 310;

var BASE_TILE_ID = 3;

var track_tile_images = new Array();

function getTrackTileImage(id) {
  if (track_tile_images[id] == undefined) {
    track_tile_images[id] = new Image();
    track_tile_images[id].src = '/assets/tiles/' + id + '.png';
  }

  return track_tile_images[id];
}

var world_tiles = new Array();

function getWorldTile(x, y) {
  if (world_tiles[x][y] == undefined) {
    return getTrackTileImage(BASE_TILE_ID);
  } else {
    return world_tiles[x][y];
  }
}

// The world is 50x50 for now
var world_height_tile = 20;
var world_width_tile = 28;

function setWorldTiles() {
  // Define an array of x tiles for each y tile
  for (var x = 0; x < world_width_tile; x++) {
    world_tiles[x] = new Array();
  }

  world_tiles[8][4] = getTrackTileImage(20);
  world_tiles[8][5] = getTrackTileImage(38);
  world_tiles[8][6] = getTrackTileImage(33);
  world_tiles[8][7] = getTrackTileImage(56);
  world_tiles[8][8] = getTrackTileImage(74);

  world_tiles[9][4] = getTrackTileImage(21);
  world_tiles[9][5] = getTrackTileImage(39);
  world_tiles[9][6] = getTrackTileImage(35);
  world_tiles[9][7] = getTrackTileImage(57);
  world_tiles[9][8] = getTrackTileImage(75);

  world_tiles[10][4] = getTrackTileImage(16);
  world_tiles[10][5] = getTrackTileImage(52);
  world_tiles[10][7] = getTrackTileImage(16);
  world_tiles[10][8] = getTrackTileImage(52);

  world_tiles[11][4] = getTrackTileImage(16);
  world_tiles[11][5] = getTrackTileImage(52);
  world_tiles[11][7] = getTrackTileImage(16);
  world_tiles[11][8] = getTrackTileImage(52);

  world_tiles[12][4] = getTrackTileImage(99);
  world_tiles[12][5] = getTrackTileImage(101);
  world_tiles[12][7] = getTrackTileImage(19);
  world_tiles[12][8] = getTrackTileImage(312);

  world_tiles[13][4] = getTrackTileImage(16);
  world_tiles[13][5] = getTrackTileImage(52);
  world_tiles[13][8] = getTrackTileImage(14);

  world_tiles[14][4] = getTrackTileImage(22);
  world_tiles[14][5] = getTrackTileImage(40);
  world_tiles[14][6] = getTrackTileImage(36);
  world_tiles[14][8] = getTrackTileImage(14);

  world_tiles[15][4] = getTrackTileImage(23);
  world_tiles[15][5] = getTrackTileImage(41);
  world_tiles[15][6] = getTrackTileImage(311);
  world_tiles[15][7] = getTrackTileImage(13);
  world_tiles[15][8] = getTrackTileImage(53);

}

function draw() {
  var local_car = getLocalPlayer();

  if (local_car != undefined) {
    var canvas = document.getElementById('wheels');
    var ctx = canvas.getContext('2d');

    ctx.font = "12px Arial";

    var local_car_x = local_car.position.x;
    var local_car_y = local_car.position.y;

    var origin_x = canvas.width / 2;
    var origin_y = canvas.height / 2;

    // Clear the canvas so we can draw again
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    var base = getTrackTileImage(BASE_TILE_ID);

    for (var y = 0; y < world_height_tile; y++) {
      for (var x = 0; x < world_width_tile; x++) {
        var img = getWorldTile(x, y);

        // Get image offset compared to local player
        var image_x = (img.width * x) - local_car_x;
        var image_y = (img.height * y) - local_car_y;

        if (base != img) {
            ctx.drawImage(base, image_x, image_y);
        }

        ctx.drawImage(img, image_x, image_y);
      }
    }

    _.forEach(car_array, function(car) {
      if (car != undefined) {
        drawCar(car);
      }
    });

    //ctx.fillText("x: " + getLocalPlayer().position.x.toFixed(2) + ", y: " + getLocalPlayer().position.y.toFixed(2), 25, 25);
  }

  requestAnimationFrame(draw);

  function drawCar(car) {
    // http://engineeringdotnet.blogspot.co.uk/2010/04/simple-2d-car-physics-in-games.html

    var car_pos_x = car.position.x - local_car_x + origin_x;
    var car_pos_y = car.position.y - local_car_y + origin_y;

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

    var car_img = getVehicleImage(car.model, car.color);
    if (car_img != undefined) {
      ctx.drawImage(car_img, car_pos_x - (car_width * 0.6), car_pos_y - (car_height * 0.8), car_width * 1.2, car_height * 1.6);
    }

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

var LOCAL_PLAYER_ID;

socket.on("local player id", function(id) {
  LOCAL_PLAYER_ID = id;
});

socket.on("player join", function(player_data) {
  car_array[player_data.id] = player_data;
});

socket.on("player leave", function(player_id) {
  car_array[player_id] = undefined;
});

socket.on("player update", function(player_data) {
  car_array[player_data.id] = player_data;
});

/*
 * The local player is always sent first, so it will
 * always be in the first array slot.
 */

function getLocalPlayer() {
  return car_array[LOCAL_PLAYER_ID];
}

function updatePlayer() {
  socket.emit("update player", getLocalPlayer());
}

function loaded() {
  var canvas = document.getElementById('wheels');

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  loadVehicleImages();
  setWorldTiles();

  setInterval(function() { process(); }, 25);

  setInterval(function() { updatePlayer(); }, 100);

  requestAnimationFrame(draw);
}
