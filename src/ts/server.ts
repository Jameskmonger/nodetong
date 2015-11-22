/// <reference path="../typings/socket.io/socket.io.d.ts" />
/// <reference path="../typings/express/express.d.ts" />

var Express = require('express');
var SocketIO = require('socket.io');
var GameServer = require('./GameServer').GameServer;
var RouteManager = require('./RouteManager').RouteManager;

var routeMgr = new RouteManager(Express);

var io = new SocketIO(routeMgr.getServer());
var gameSvr = new GameServer(io);
