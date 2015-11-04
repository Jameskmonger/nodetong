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
    socket.player_data.speed = player_data.speed;

    if (socket.player_data.position.rotation.wheel_deg != player_data.wheel)
      console.log(socket.player_data.position.rotation.wheel_deg + " - " + player_data.wheel)

    socket.player_data.position.rotation.wheel_deg = player_data.wheel;

    //socket.broadcast.emit("player update", player_data);
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

setInterval(loop, 25);

function loop() {
  for (var i = 0; i < socketList.length; i++) {
    var car = socketList[i].player_data;

    moveCar(car);
  }
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

  return car;
}

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
