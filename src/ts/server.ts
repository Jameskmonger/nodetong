/// <reference path="../typings/socket.io/socket.io.d.ts" />
/// <reference path="../typings/express/express.d.ts" />

var Express = require('express');
var SocketIO = require('socket.io');

import GameServer = require('./GameServer');
import RouteManager = require('./RouteManager');

var routeMgr = new RouteManager.RouteManager(Express);

var io = new SocketIO(routeMgr.getServer());
var gameSvr = new GameServer.GameServer(io);
