/// <reference path="../typings/socket.io/socket.io.d.ts" />
/// <reference path="../typings/express/express.d.ts" />

var express = require('express');
var app = express();

app.use("/assets", express.static(__dirname + "/assets"));

app.use("/script", express.static(__dirname + "/script"));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

var server = app.listen(3000, function () {
  var host : string = server.address().address;
  var port : number = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
