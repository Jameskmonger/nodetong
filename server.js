var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var shortid = require('shortid');
var config = require('./config');

var Vehicle = require('./script/app/Vehicle');
var Player = require('./script/app/Player');

shortid.characters("0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_");

app.use("/assets/vehicles", express.static(__dirname + "/assets/vehicles"));

app.use("/assets/tiles", express.static(__dirname + '/assets/tiles'));

app.use("/lib", express.static(__dirname + '/lib'));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.get("/script/:filename", function(req, res) {
  var filename = req.params.filename;
  res.sendFile(__dirname + '/script/' + filename);
});

app.get("/script/modules/:filename", function(req, res) {
  var filename = req.params.filename;
  res.sendFile(__dirname + '/script/modules/' + filename);
});

app.get("/script/app/:filename", function(req, res) {
  var filename = req.params.filename;
  res.sendFile(__dirname + '/script/app/' + filename);
});

var MAX_PLAYER_COUNT = 2000;

var socketList = [];

function getFirstEmptyPlayerSlot() {
  for (var i = 0; i < MAX_PLAYER_COUNT; i++) {
    if (socketList[i] == undefined) {
      return i;
    }
  }

  return -1;
}

var player_count = 0;

io.sockets.on('connection', function(socket) {
  var id = getFirstEmptyPlayerSlot();
	socket.player_data = createPlayerObject(id);

	socketList[id] = socket;
  player_count++;

  WORLD_HEIGHT_TILE = 20;
  WORLD_WIDTH_TILE = 28;
  BASE_TILE_ID = 3;

  var world_tiles = new Array();

  // Define an array of x tiles for each y tile
  for (var x = 0; x < WORLD_WIDTH_TILE; x++) {
    world_tiles[x] = new Array();
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

  var world_data =
  {
    width: WORLD_WIDTH_TILE,
    height: WORLD_HEIGHT_TILE,
    base: BASE_TILE_ID,
    tiles: world_tiles
  }

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
  });

	socket.on('disconnect', function() {
    socketList[id] = undefined;
    player_count--;

		io.emit("player leave", id);

		console.log("Player " + id + " disconnected. [" + player_count + " players online]");
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

    var car = socketList[i].player_data;

    io.emit("player update", car);
  }
}

var VEHICLE_COLOR_COUNT = 4;

function getRandomColor() {
	return getRandomInt(0, VEHICLE_COLOR_COUNT);
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createPlayerObject(id) {
  var player = new Player({id: id, name: "Boris"});

  var player_vehicle = player.getVehicle();

  player_vehicle.setPosition(1470.0, 635.0);
  player_vehicle.setWheelRotation(90.0);
  player_vehicle.setVehicleRotation(90.0);

  return player;
}
