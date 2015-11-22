/// <reference path="../typings/socket.io/socket.io.d.ts" />
/// <reference path="../typings/express/express.d.ts" />

var express = require('express');
var app = express();

app.use("/assets", express.static(__dirname + "/assets"));
app.use("/lib", express.static(__dirname + '/lib'));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.get("/script/:filename", function(req, res) {
  var filename = req.params.filename;
  res.sendFile(__dirname + '/script/' + filename);
});

app.get("/script/app/:filename", function(req, res) {
  var filename = req.params.filename;
  res.sendFile(__dirname + '/script/app/' + filename);
});

app.get("/script/app/:folder/:filename", function(req, res) {
  var folder = req.params.folder;
  var filename = req.params.filename;

  if (folder === 'Animation' || folder === 'Networking' || folder === 'World') {
    res.sendFile(__dirname + '/script/app/' + folder + '/' + filename);
  }
});

var server = app.listen(3000, function () {
  var host : string = server.address().address;
  var port : number = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
