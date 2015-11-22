var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var config = require('./config');

var Vehicle = require('./script/app/Vehicle');
var Player = require('./script/app/Player');

var fs = require('fs'),
    PNG = require('pngjs').PNG;

var WORLD_HEIGHT_TILE, WORLD_WIDTH_TILE, BASE_TILE_ID;

var friction_maps = [];

function initialiseFrictionMaps() {
  for (var t = 0; t < HIGHEST_TILE_ID; t++) {
    friction_maps[t] = [];

    for (var x = 0; x < 128; x++) {
      friction_maps[t][x] = [];
    }
  }

  fillFrictionMaps();
}

function fillFrictionMaps() {
  for (var t = 0; t < HIGHEST_TILE_ID; t++) {
    if (used_in_world[t] !== true) {
      continue;
    }

    loadFrictionMap(t);
  }

  console.log("Friction maps loaded");
}

function setFrictionMap(id, map) {
  friction_maps[id] = map;
}

function loadFrictionMap(id) {
  if (used_in_world[id] !== true) {
    return undefined;
  }

  fs.createReadStream(__dirname + '/assets/friction_maps/' + id + '.png')
    .pipe(new PNG({
        filterType: 4
    }))
    .on('parsed', function() {
      var map = [];

        for (var x = 0; x < this.width; x++) {
          map[x] = [];
            for (var y = 0; y < this.height; y++) {
                var idx = (this.width * y + x) << 2;

                map[x][y] = this.data[idx];
            }
        }

        setFrictionMap(id, map);
    });
}

var used_in_world = [];

function getHighestTileId() {
  var highest = -9999;

  for (var x = 0; x < WORLD_WIDTH_TILE; x++) {
    for (var y = 0; y < WORLD_HEIGHT_TILE; y++) {
      if (world_tiles[x][y] === undefined) {
        continue;
      }

      used_in_world[world_tiles[x][y]] = true;

      if (world_tiles[x][y] > highest) {
        highest = world_tiles[x][y];
      }
    }
  }

  return highest;
}

var world_tiles = [];

var socketList = [];

var HIGHEST_TILE_ID;

loaded();

function loaded() {
  WORLD_HEIGHT_TILE = 20;
  WORLD_WIDTH_TILE = 28;
  BASE_TILE_ID = 3;

  // Define an array of x tiles for each y tile
  for (var x = 0; x < WORLD_WIDTH_TILE; x++) {
    world_tiles[x] = [];
  }

  world_tiles[8][4] = 20;
  world_tiles[8][5] = 38;
  world_tiles[8][6] = 33;
  world_tiles[8][7] = 56;
  world_tiles[8][8] = 74;

  world_tiles[9][4] = 21;
  world_tiles[9][5] = 39;
  world_tiles[9][6] = 35;
  world_tiles[9][7] = 57;
  world_tiles[9][8] = 75;

  world_tiles[10][4] = 16;
  world_tiles[10][5] = 52;
  world_tiles[10][7] = 16;
  world_tiles[10][8] = 52;

  world_tiles[11][4] = 16;
  world_tiles[11][5] = 52;
  world_tiles[11][7] = 16;
  world_tiles[11][8] = 52;

  world_tiles[12][4] = 99;
  world_tiles[12][5] = 101;
  world_tiles[12][7] = 19;
  world_tiles[12][8] = 312;

  world_tiles[13][4] = 16;
  world_tiles[13][5] = 52;
  world_tiles[13][8] = 14;

  world_tiles[14][4] = 22;
  world_tiles[14][5] = 40;
  world_tiles[14][6] = 36;
  world_tiles[14][8] = 14;

  world_tiles[15][4] = 23;
  world_tiles[15][5] = 41;
  world_tiles[15][6] = 311;
  world_tiles[15][7] = 13;
  world_tiles[15][8] = 53;

  HIGHEST_TILE_ID = getHighestTileId();

  initialiseFrictionMaps();
}

var player_count = 0;

io.sockets.on('connection', function(socket) {
  var id = getFirstEmptyPlayerSlot();
	socket.player_data = createPlayerObject(id);

	socketList[id] = socket;
  player_count++;

  var world_data =
  {
    width: WORLD_WIDTH_TILE,
    height: WORLD_HEIGHT_TILE,
    base: BASE_TILE_ID,
    tiles: world_tiles
  };

  var initialisation_data =
  {
    id: id,
    world: world_data
  };
  socket.emit("initialise local player", initialisation_data);

  socket.broadcast.emit("player join", socket.player_data);

  for (var i = 0; i < socketList.length; i++) {
    var player = socketList[i].player_data;

    socket.emit("player join", socketList[i].player_data);
  }

	console.log("Player " + id + " connected. [" + player_count + " players online]");

  socket.on("update player", function(player_data) {
    socket.player_data.getVehicle().setSpeed(player_data.speed);
    socket.player_data.getVehicle().setWheelRotation(player_data.wheel);
    socket.player_data.getVehicle().setEnginePower(player_data.force.engine);
    socket.player_data.getVehicle().setBrakingForce(player_data.force.braking);
  });
});

http.listen(config.port, function() {
	console.log('listening on *:' + config.port);
});

setInterval(loop, 50);

function loop() {
  for (var i = 0; i < socketList.length; i++) {
    if (socketList[i] === undefined) {
      continue;
    }

    var player = socketList[i].player_data;

    player.getVehicle().processMovement();

    io.emit("player update", player);
  }
}



var VEHICLE_COLOR_COUNT = 4;

function getRandomColor() {
	return getRandomInt(0, VEHICLE_COLOR_COUNT);
}

function getTileId(x, y) {
  if (world_tiles[x][y] === undefined) {
    return BASE_TILE_ID;
  }

  return world_tiles[x][y];
}

function getFrictionMapPixelColor(id, x, y) {
  return friction_maps[id][x][y];
}

function createPlayerObject(id) {
  var player = new Player({id: id, name: getRandomName()});

  var player_vehicle = player.getVehicle();

  player_vehicle.setPosition(1470.0, 635.0);
  player_vehicle.setWheelRotation(90.0);
  player_vehicle.setVehicleRotation(90.0);

  player_vehicle.color = getRandomColor();

  player_vehicle.is_server_instance = true;

  var methods = {
    getTileId: getTileId,
    getFrictionMapPixelColor: getFrictionMapPixelColor
  };

  player_vehicle._server_methods = methods;

  return player;
}
