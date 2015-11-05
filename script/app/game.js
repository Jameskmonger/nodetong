define(['./key_handler'], function (key_handler) {
  var GAME_LOOP_INTERVAL = 25;

  var LOCAL_PLAYER_ID;

  var scale = 1.4;

  var wheel_width = 5 * scale, wheel_length = 11 * scale;
  var car_width = 21 * scale, car_height = 25 * scale;
  var wheel_base = car_height + wheel_length / 4;

  var world_canvas;

  loaded();

  function loaded() {
    setInterval(game_loop, GAME_LOOP_INTERVAL);

    world_canvas = {
      canvas: document.getElementById('world_canvas'),
      context: document.getElementById('world_canvas').getContext('2d')
    };
  }

  var car_array = [];

  var player_gear = 1, been_in_gear = 999999;

  var GEAR_WAIT_TIME = 20, LOWEST_GEAR = -1, HIGHEST_GEAR = 1;

  var TRACK_COLOURS =
  [
    [164, 199, 201],
    [168, 203, 205],
    [184, 214, 215],
    [189, 218, 219],
    [158, 192, 194],
    [161, 196, 198],
  ];

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
      if (player_gear == -1) {
        if (local_car.speed - 0.5 > -2.0) {
          local_car.speed -= 0.3;
        } else {
          local_car.speed = -2.0;
        }
      } else if (player_gear > 0) {
        if (local_car.speed + 0.5 < 4.0) {
          local_car.speed += 0.3;
        } else {
          local_car.speed = 4.0;
        }
      }

      if (movement_network_listener != undefined)
      {
        movement_network_listener();
      }
    }

    if (key_handler.pressing(key_handler.KeyCodes.DOWN)) {
      // We need to apply different speeds if we're reversing
      if (local_car.speed < 0.0) {
        if (local_car.speed < -0.5) {
          local_car.speed *= 0.8;
        } else if (local_car.speed >= -0.5 && local_car.speed < -0.1) {
          local_car.speed *= 0.6;
        } else {
          local_car.speed = 0.0;
        }
      } else {
        if (local_car.speed > 0.5) {
          local_car.speed *= 0.8;
        } else if (local_car.speed <= 0.5 && local_car.speed > 0.1) {
          local_car.speed *= 0.6;
        } else {
          local_car.speed = 0.0;
        }
      }

      if (movement_network_listener != undefined)
      {
        movement_network_listener();
      }
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

  function moveCar(car) {
    var wheel_rotation_rad = (car.position.rotation.wheel_deg - 90) * (Math.PI / 180);
    var car_rotation_rad = (car.position.rotation.car_deg - 90) * (Math.PI/180);

    var dt = 1;

    var front_modifier = 0;
    var back_modifier = 0;

    front_modifier = (car_rotation_rad + wheel_rotation_rad);
    back_modifier = car_rotation_rad;

    car.position.wheels.front.x += car.speed * dt * Math.cos(front_modifier);
    car.position.wheels.front.y += car.speed * dt * Math.sin(front_modifier);

    car.position.wheels.back.x += car.speed * dt * Math.cos(back_modifier);
    car.position.wheels.back.y += car.speed * dt * Math.sin(back_modifier);

    car.position.x = (car.position.wheels.front.x + car.position.wheels.back.x) / 2;
    car.position.y = (car.position.wheels.front.y + car.position.wheels.back.y) / 2;

    car.position.rotation.car_deg = (Math.atan2(car.position.wheels.front.y - car.position.wheels.back.y , car.position.wheels.front.x - car.position.wheels.back.x) * (180/Math.PI)) + 90;
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
          car_array[id].position.x = data.position.x;
          car_array[id].position.y = data.position.y;
          car_array[id].position.rotation.car_deg = data.position.rotation.car_deg;
          car_array[id].position.rotation.car_rad = data.position.rotation.car_rad;
        }
      } else {
        requires_full_update = true;
      }
    } else {
      requires_full_update = true;
    }

    if (requires_full_update) {
      car_array[id] = data;
    }
  }

  return {
    getLocalPlayer: getLocalPlayer,
    getBaseTileImage: getBaseTileImage,
    getWorldDimensions: getWorldDimensions,
    getWorldTile: getWorldTile,
    car_array: car_array,
    player_gear: player_gear,
    setLocalPlayerId: setLocalPlayerId,
    setCarData: setCarData,
    setMovementListener: setMovementListener,
    setWorldTiles: setWorldTiles
  }
});
