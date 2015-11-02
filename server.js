var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var shortid = require('shortid');
var config = require('./config');

shortid.characters("0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_");

app.use("/assets/tiles", express.static(__dirname + '/assets/tiles'));

app.use("/lib", express.static(__dirname + '/lib'));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.get('/client.js', function(req, res) {
  res.sendFile(__dirname + '/client.js');
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

function getRandomColor() {
	return Math.floor(Math.random()*16777215).toString(16);
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
        car_deg: 0,
        car_rad: 0
      },
      x: 50,
      y: 50
    },
    color: getRandomColor(),
    speed: 0.0,
    steering_mode: 0
  });
}
