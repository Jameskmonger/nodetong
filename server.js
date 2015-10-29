var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var shortid = require('shortid');

shortid.characters("0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_");

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

var socketList = [];

io.sockets.on('connection', function(socket) {
	socket.player_id = shortid.generate();
	
	socketList.push(socket);
	
	console.log("Player " + socket.player_id + " connected. [" + socketList.length + " players online]");
	
	initialisePlayer(socket);
	
	socket.on('disconnect', function() {
		var i = socketList.indexOf(socket);
		socketList.splice(i, 1)
		
		io.emit("player leave", socket.player_id);
		
		console.log("Player " + socket.player_id + " disconnected. [" + socketList.length + " players online]");
	});
	
	socket.on('movement update', function(position) {
		socket.position = position;
		io.emit("position update", getPlayerData(socket));
	});
});

http.listen(3000, function() {
	console.log('listening on *:3000');
});

function initialisePlayer(socket) {
	socket.position = getRandomPosition();
	
	socket.player_color = getRandomColor();
	
	socket.emit("initialisation request", getPlayerData(socket));
	
	io.emit("player join", getPlayerData(socket));
	
	socketList.forEach(function(other) {
		if (other != socket) {
			socket.emit("player join", getPlayerData(other));
		}
	});
}

function getRandomColor() {
	return Math.floor(Math.random()*16777215).toString(16);
}

function getPlayerData(socket) {
	return {"id": socket.player_id, "position": socket.position, "color": socket.player_color};
}

function getRandomPosition(dimensions) {
	var x = getRandomInt(0, 500);
	var y = getRandomInt(0, 500);
	
	var position = { "x": x, "y": y };
	
	return position;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
