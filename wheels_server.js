var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var shortid = require('shortid');
var config = require('./config');

shortid.characters("0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_");

app.use("/lib", express.static(__dirname + '/lib'));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/wheels.html');
});

var socketList = [];

io.sockets.on('connection', function(socket) {
	socket.player_data = createPlayerObject(shortid.generate());
	socketList.push(socket);

  io.emit("player join", socket.player_data);

  for (var i = 0; i < socketList.length; i++) {
    if (socket != socketList[i]) {
      socket.emit("player join", socketList[i].player_data);
    }
  }

	console.log("Player " + socket.player_data.id + " connected. [" + socketList.length + " players online]");

  socket.on("update player", function(player_data) {
    socket.player_data = player_data;
    socket.broadcast.emit("player update", player_data);
  });

	socket.on('disconnect', function() {
		var i = socketList.indexOf(socket);
		socketList.splice(i, 1);

		io.emit("player leave", socket.player_data.id);

		console.log("Player " + socket.player_data.id + " disconnected. [" + socketList.length + " players online]");
	});
});

http.listen(config.port, function() {
	console.log('listening on *:' + config.port);
});

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
    speed: 0.0,
    steering_mode: 0
  });
}
