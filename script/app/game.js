define(['./key_handler', './Vector', './Vehicle'], function (key_handler, Vector, Vehicle) {
  var GAME_LOOP_INTERVAL = 25;

  var LOCAL_PLAYER_ID;

  loaded();

  function loaded() {
    setInterval(game_loop, GAME_LOOP_INTERVAL);
  }

  var car_array = [];

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
      local_car.setEnginePower(100.0);
    }

    if (!key_handler.pressing(key_handler.KeyCodes.UP)) {
      local_car.setEnginePower(0.0);
    }

    if (key_handler.pressing(key_handler.KeyCodes.DOWN)) {
      local_car.setBrakingForce(150.0);
    }

    if (!key_handler.pressing(key_handler.KeyCodes.DOWN)) {
      local_car.setBrakingForce(0.0);
    }

    if (key_handler.pressing(key_handler.KeyCodes.LEFT)) {
      local_car.turnWheelLeft(movement_network_listener);
    }

    if (key_handler.pressing(key_handler.KeyCodes.RIGHT)) {
      local_car.turnWheelRight(movement_network_listener);
    }

    if (key_handler.pressing(key_handler.KeyCodes.LEFT) != true && key_handler.pressing(key_handler.KeyCodes.RIGHT) != true) {
      local_car.straightenWheel(movement_network_listener);
    }

    _.forEach(car_array, function(car) {
      if (car != undefined) {
        car.processMovement();
      }
    });
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
    if (data == null) {
      return;
    }

    var requires_full_update;

    if (id === LOCAL_PLAYER_ID) {
      if (car_array[id] !== undefined) {
        var close_to_x = (data.position.x.closeTo(car_array[id].position.x, 2.0));
        var close_to_y = (data.position.y.closeTo(car_array[id].position.y, 2.0));

        if (!close_to_x || !close_to_y) {
          car_array[id].setPosition(data.position.x, data.position.y);
          car_array[id].setRotation(data.position.rotation.car_deg);
        }
      } else {
        requires_full_update = true;
      }
    } else {
      requires_full_update = true;
    }

    if (requires_full_update) {
      var new_car = new Vehicle();
      new_car.setPosition(data.position.x, data.position.y);
      new_car.setVehicleRotation(data.position.rotation.car_deg);

      car_array[id] = new_car;
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
    setWorldLoadedListener: setWorldLoadedListener
  }
});
