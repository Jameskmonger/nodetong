define(['./KeyHandler', './Vector', './Vehicle', './Player', './World'], function (KeyHandler, Vector, Vehicle, Player, World) {
  var KEY_DETECTION_INTERVAL = 25;
  var GAME_LOOP_INTERVAL = 50;

  var LOCAL_PLAYER_ID;

  loaded();

  var key_handler, world;

  function loaded() {
    key_handler = new KeyHandler(document);
    world = new World();

    setInterval(key_detection_loop, KEY_DETECTION_INTERVAL);
    setInterval(game_loop, GAME_LOOP_INTERVAL);
  }

  function getWorld() {
    return world;
  }

  var movement_network_listener;

  function setMovementListener(listener) {
    movement_network_listener = listener;
  };

  function key_detection_loop() {
    if (getLocalPlayer() === undefined) {
      return;
    }

    var local_car = getLocalPlayer().getVehicle();

    if (local_car === undefined) {
      return;
    }

    if (key_handler.pressing(KeyHandler.KeyCodes.UP)) {
      local_car.setEnginePower(100.0);

      movement_network_listener();
    }

    if (!key_handler.pressing(KeyHandler.KeyCodes.UP)) {
      local_car.setEnginePower(0.0);

      movement_network_listener();
    }

    if (key_handler.pressing(KeyHandler.KeyCodes.DOWN)) {
      local_car.setBrakingForce(150.0);

      movement_network_listener();
    }

    if (!key_handler.pressing(KeyHandler.KeyCodes.DOWN)) {
      local_car.setBrakingForce(0.0);

      movement_network_listener();
    }

    if (key_handler.pressing(KeyHandler.KeyCodes.LEFT)) {
      local_car.turnWheelLeft(movement_network_listener);

      movement_network_listener();
    }

    if (key_handler.pressing(KeyHandler.KeyCodes.RIGHT)) {
      local_car.turnWheelRight(movement_network_listener);

      movement_network_listener();
    }

    if (key_handler.pressing(KeyHandler.KeyCodes.LEFT) !== true && key_handler.pressing(KeyHandler.KeyCodes.RIGHT) !== true) {
      local_car.straightenWheel(movement_network_listener);

      movement_network_listener();
    }
  }

  function game_loop() {
    _.forEach(player_array, function(player) {
      if (player !== undefined) {
        player.getVehicle().processMovement();
      }
    });
  }

  /*
   * The local player is always sent first, so it will
   * always be in the first array slot.
   */

  function getLocalPlayer() {
    return player_array[LOCAL_PLAYER_ID];
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

  var player_array = [];

  function removePlayer(id) {
    player_array[id] = undefined;
  }

  function setCarData(id, data) {
    if (data === undefined) {
      return;
    }

    var requires_full_update;

    if (id === LOCAL_PLAYER_ID) {
      if (player_array[id] !== undefined) {
        var vehicle = new Vehicle(data._vehicle);
        var player_vehicle = player_array[id].getVehicle();

        var close_to_x = (vehicle.position.x.closeTo(player_vehicle.position.x, 0.1));
        var close_to_y = (vehicle.position.y.closeTo(player_vehicle.position.y, 0.1));

        if (!close_to_x || !close_to_y) {
          player_array[id].getVehicle().setPosition(vehicle.position.x, vehicle.position.y);
        }

        var matches_rotation = (vehicle.rotation.vehicle == player_vehicle.rotation.vehicle);

        if (!matches_rotation) {
          player_array[id].getVehicle().setVehicleRotation(vehicle.rotation.vehicle);
        }
      } else {
        requires_full_update = true;
      }
    } else {
      requires_full_update = true;
    }

    if (requires_full_update) {
      var player = new Player(data);

      player._vehicle = new Vehicle(player._vehicle);

      player_array[id] = player;
    }
  }

  function getPlayerArray() {
    return player_array;
  }

  return {
    getLocalPlayer: getLocalPlayer,
    getBaseTileImage: getBaseTileImage,
    getWorldDimensions: getWorldDimensions,
    getWorldTile: getWorldTile,
    getPlayerArray: getPlayerArray,
    setLocalPlayerId: setLocalPlayerId,
    setCarData: setCarData,
    setMovementListener: setMovementListener,
    setWorldTiles: setWorldTiles,
    setWorldLoadedListener: setWorldLoadedListener,
    removePlayer: removePlayer,
    getWorld: getWorld
  }
});
