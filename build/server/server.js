var Express = require('express');
var SocketIO = require('socket.io');
var GameServer = require('./GameServer');
var RouteManager = require('./RouteManager');
var routeMgr = new RouteManager.RouteManager(Express);
var io = new SocketIO(routeMgr.getServer());
var gameSvr = new GameServer.GameServer(io);
