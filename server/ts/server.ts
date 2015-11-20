/// <reference path="../../typings/socket.io/socket.io.d.ts" />
/// <reference path="../../typings/express/express.d.ts" />

var express = require('express');
var app = express();

app.get('/', function(req, res) {
  res.send("hi!");
});

var server = app.listen(3000, function () {
  var host : string = server.address().address;
  var port : number = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
