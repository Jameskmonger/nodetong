var Express = require('express');
var SocketIO = require('socket.io');
var GameServer_1 = require("./GameServer");
var RouteManager = require('./RouteManager');
var routeMgr = new RouteManager.RouteManager(Express);
var io = new SocketIO(routeMgr.getServer());
var gameSvr = GameServer_1.GameServer.get(io);
