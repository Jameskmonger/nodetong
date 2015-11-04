var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var shortid = require('shortid');
var config = require('./config');

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

  socket.emit("local player id", id);

  socket.broadcast.emit("player join", socket.player_data);

  for (var i = 0; i < socketList.length; i++) {
    socket.emit("player join", socketList[i].player_data);
  }

	console.log("Player " + id + " connected. [" + player_count + " players online]");

  socket.on("update player", function(player_data) {
    socket.player_data = player_data;

    socket.broadcast.emit("player update", player_data);
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

var VEHICLE_COLOR_COUNT = 4;

function getRandomColor() {
	return getRandomInt(0, VEHICLE_COLOR_COUNT);
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createPlayerObject(id) {
  return ({
    id: id,
    position: {
      wheels: {
        front: {
          x: 0,
          y: 0
        },
        back: {
          x: 0,
          y: 0
        }
      },
      rotation: {
        wheel_deg: 90,
        car_deg: 90,
        car_rad: 1.5708
      },
      x: 1470.00,
      y: 635.00
    },
    color: getRandomColor(),
    model: 0,
    speed: 0.0,
    steering_mode: 0
  });
}
