define(['./key_handler', './Vector'], function (key_handler, Vector) {
  var GAME_LOOP_INTERVAL = 25;

  var LOCAL_PLAYER_ID;

  var scale = 1.4;

  var wheel_width = 5 * scale, wheel_length = 11 * scale;
  var car_width = 21 * scale, car_height = 25 * scale;
  var wheel_base = car_height + wheel_length / 4;

  var world_canvas;

  var local_car_velocity;

  loaded();

  function loaded() {
    setInterval(game_loop, GAME_LOOP_INTERVAL);

    local_car_velocity = new Vector(0, 0);

    world_canvas = {
      canvas: document.getElementById('world_canvas'),
      context: document.getElementById('world_canvas').getContext('2d')
    };
  }

  var car_array = [];

  var player_gear = 1, been_in_gear = 999999;

  var GEAR_WAIT_TIME = 20, LOWEST_GEAR = -1, HIGHEST_GEAR = 1;

  var movement_network_listener;

  function setMovementListener(listener) {
    movement_network_listener = listener;
  };

  function game_loop() {
    var local_car = getLocalPlayer();

    if (local_car == undefined) {
      return;
    }

    if (key_handler.pressing(key_handler.KeyCodes.UP)) {
      local_car_engine_force = 100.0;

      if (movement_network_listener != undefined)
      {
        movement_network_listener();
      }
    }

    if (!key_handler.pressing(key_handler.KeyCodes.UP)) {
      local_car_engine_force = 0.0;
    }

    if (key_handler.pressing(key_handler.KeyCodes.DOWN)) {
      local_car_braking_force = 50.0;

      if (movement_network_listener != undefined)
      {
        movement_network_listener();
      }
    }

    if (!key_handler.pressing(key_handler.KeyCodes.DOWN)) {
      local_car_braking_force = 0.0;
    }

    if (key_handler.pressing(key_handler.KeyCodes.LEFT)) {
      turnWheelLeft(local_car);
    }

    if (key_handler.pressing(key_handler.KeyCodes.RIGHT)) {
      turnWheelRight(local_car);
    }

    if (key_handler.pressing(key_handler.KeyCodes.LEFT) != true && key_handler.pressing(key_handler.KeyCodes.RIGHT) != true) {
      straightenWheel(local_car);
    }

    if (key_handler.pressing(key_handler.KeyCodes.Q_KEY) != true && key_handler.pressing(key_handler.KeyCodes.E_KEY) != true) {
      if (been_in_gear != 999999) {
        been_in_gear++;
      }
    }

    if (key_handler.pressing(key_handler.KeyCodes.Q_KEY)) {
      changeDownGear();
    }

    if (key_handler.pressing(key_handler.KeyCodes.E_KEY)) {
      changeUpGear();
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

  var local_car_engine_force = 0, local_car_braking_force = 0;

  var FRICTION_COEFFICIENT = 0.30, CAR_MASS = 1000, CAR_FRONTAL_AREA = 2.2, AIR_DENSITY = 1.29;
  var DRAG_CONSTANT = 0.5 * FRICTION_COEFFICIENT * CAR_FRONTAL_AREA * AIR_DENSITY;

  var DRAG_ROLLING_RESISTANCE = 30 * DRAG_CONSTANT;

  function moveCar(car) {
    var dt = 1;

    var car_rotation_rad = Math.radians(car.position.rotation.car_deg - 90);
    var car_backwards_rotation_rad = car_rotation_rad - Math.PI;

    var wheel_rotation_rad = Math.radians(car.position.rotation.wheel_deg - 90);

    var car_heading = new Vector(Math.cos(car_rotation_rad), Math.sin(car_rotation_rad));
    var car_backwards_heading = new Vector(Math.cos(car_backwards_rotation_rad), Math.sin(car_backwards_rotation_rad));

    var speed = local_car_velocity.magnitude();

    var f_engine = car_heading.multiplyScalar(local_car_engine_force);

    var f_braking = car_backwards_heading.multiplyScalar(local_car_braking_force);

    var f_traction = f_engine.addVector(f_braking);

    var f_drag = local_car_velocity.multiplyScalar(speed * (DRAG_CONSTANT * -1));

    var f_rolling_resistance = local_car_velocity.multiplyScalar(DRAG_ROLLING_RESISTANCE * -1);

    var f_longitudinal = f_traction.addVector(f_drag).addVector(f_rolling_resistance);

    // Divide by CAR_MASS
    var acceleration = f_longitudinal.multiplyScalar(1 / CAR_MASS);

    local_car_velocity = local_car_velocity.addVector(acceleration.multiplyScalar(dt));

    speed = local_car_velocity.magnitude();

    var front_modifier = (Math.atan2(car_heading.y, car_heading.x) + wheel_rotation_rad);
    var back_modifier = Math.atan2(car_heading.y, car_heading.x);

    car.position.wheels.front.x += speed * Math.cos(front_modifier);
    car.position.wheels.front.y += speed * Math.sin(front_modifier);

    car.position.wheels.back.x += speed * Math.cos(back_modifier);
    car.position.wheels.back.y += speed * Math.sin(back_modifier);

    car.position.x = (car.position.wheels.front.x + car.position.wheels.back.x) / 2;
    car.position.y = (car.position.wheels.front.y + car.position.wheels.back.y) / 2;

    car.position.rotation.car_deg = (Math.atan2(car.position.wheels.front.y - car.position.wheels.back.y , car.position.wheels.front.x - car.position.wheels.back.x) * (180/Math.PI)) + 90;
  }

  function getPlayerGear() {
    return player_gear;
  }

  function changeDownGear() {
    if (been_in_gear > GEAR_WAIT_TIME) {
      if (player_gear > LOWEST_GEAR) {
        // If the player is in neutral, they cannot go into reverse unless they're still
        if (player_gear == 0) {
          if (getLocalPlayer().speed == 0.0) {
            player_gear--;
          }
        } else {
          player_gear--;
        }
      }

      been_in_gear = 0;
    } else {
      if (been_in_gear != 999999) {
        been_in_gear++;
      }
    }
  }

  function changeUpGear() {
    if (been_in_gear > GEAR_WAIT_TIME) {
      if (player_gear < HIGHEST_GEAR) {
        player_gear++;
      }

      been_in_gear = 0;
    } else {
      if (been_in_gear != 999999) {
        been_in_gear++;
      }
    }
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

    if (movement_network_listener !== undefined)
    {
      movement_network_listener();
    }
    return;
  }

  function calculateRotationRad(car) {
    car.position.rotation.car_rad = (car.position.rotation.car_deg - 90) * (Math.PI/180);
  }

  function calculateFrontWheel(car) {
    car.position.wheels.front.x = car.position.x + wheel_base/2 * Math.cos(car.position.rotation.car_rad);
    car.position.wheels.front.y = car.position.y + wheel_base/2 * Math.sin(car.position.rotation.car_rad);
  }

  function calculateBackWheel(car) {
    car.position.wheels.back.x = car.position.x - wheel_base/2 * Math.cos(car.position.rotation.car_rad);
    car.position.wheels.back.y = car.position.y - wheel_base/2 * Math.sin(car.position.rotation.car_rad);
  }

  function getBackWheelRotationDegrees(car) {
    var rotation = car.position.rotation.wheel_deg;

    return (rotation - 2 * (rotation - 90));
  }

  /*
   * The local player is always sent first, so it will
   * always be in the first array slot.
   */

  function getLocalPlayer() {
    return car_array[LOCAL_PLAYER_ID];
  }

  var WORLD_HEIGHT_TILE;
  var WORLD_WIDTH_TILE;

  var world_tiles;

  var BASE_TILE_ID;
  var BASE_TILE_IMAGE;

  function getBaseTileImage() {
    return BASE_TILE_IMAGE;
  }

  function getWorldDimensions() {
    return {
      HEIGHT: WORLD_HEIGHT_TILE,
      WIDTH: WORLD_WIDTH_TILE
    };
  }

  var world_loaded_listener;

  function setWorldLoadedListener(listener) {
    world_loaded_listener = listener;
  }

  function setWorldTiles(world_data) {
    WORLD_HEIGHT_TILE = world_data.height;
    WORLD_WIDTH_TILE = world_data.width;
    BASE_TILE_ID = world_data.base;

    world_tiles = new Array();

    // Define an array of x tiles for each y tile
    for (var x = 0; x < WORLD_WIDTH_TILE; x++) {
      world_tiles[x] = new Array();
    }

    BASE_TILE_IMAGE = getTrackTileImage(BASE_TILE_ID);

    for (var x = 0; x < WORLD_WIDTH_TILE; x++) {
      for (var y = 0; y < WORLD_HEIGHT_TILE; y++) {
        if (world_data.tiles[x][y] != undefined) {
          world_tiles[x][y] = getTrackTileImage(world_data.tiles[x][y]);
        }
      }
    }

    world_loaded_listener();
  }

  var track_tile_images;

  function getTrackTileImage(id) {
    if (track_tile_images === undefined) {
      track_tile_images = new Array();
    }

    if (track_tile_images[id] === undefined) {
      track_tile_images[id] = new Image();
      track_tile_images[id].src = '/assets/tiles/' + id + '.png';
    }

    return track_tile_images[id];
  }

  function getWorldTile(x, y) {
    if (world_tiles[x][y] === undefined) {
      return getTrackTileImage(BASE_TILE_ID);
    } else {
      return world_tiles[x][y];
    }
  }

  Number.prototype.betweenEquals = function (min, max) {
      return (this >= min && this <= max);
  }

  Number.prototype.closeTo = function (value, range) {
    var half_range = (range / 2);
    var lower_bound = (value - half_range);
    var upper_bound = (value + half_range);

    return (this.betweenEquals(lower_bound, upper_bound));
  }

  function setLocalPlayerId(id) {
    LOCAL_PLAYER_ID = id;
  }

  function setCarData(id, data) {
    var requires_full_update;

    if (id === LOCAL_PLAYER_ID) {
      if (car_array[id] !== undefined) {
        var close_to_x = (data.position.x.closeTo(car_array[id].position.x, 2.0));
        var close_to_y = (data.position.y.closeTo(car_array[id].position.y, 2.0));

        if (!close_to_x || !close_to_y) {
          /*car_array[id].position.x = data.position.x;
          car_array[id].position.y = data.position.y;
          car_array[id].position.rotation.car_deg = data.position.rotation.car_deg;
          car_array[id].position.rotation.car_rad = data.position.rotation.car_rad;*/
        }
      } else {
        alert("Fix game.SetCarData and networking.updatePlayer - you commented stuff out!");

        requires_full_update = true;
      }
    } else {
      requires_full_update = true;
    }

    if (requires_full_update) {
      car_array[id] = data;
    }
  }

  // Converts from degrees to radians.
  Math.radians = function(degrees) {
    return degrees * Math.PI / 180;
  };

  // Converts from radians to degrees.
  Math.degrees = function(radians) {
    return radians * 180 / Math.PI;
  };

  return {
    getLocalPlayer: getLocalPlayer,
    getBaseTileImage: getBaseTileImage,
    getWorldDimensions: getWorldDimensions,
    getWorldTile: getWorldTile,
    car_array: car_array,
    setLocalPlayerId: setLocalPlayerId,
    setCarData: setCarData,
    setMovementListener: setMovementListener,
    setWorldTiles: setWorldTiles,
    setWorldLoadedListener: setWorldLoadedListener,
    getPlayerGear: getPlayerGear
  }
});
