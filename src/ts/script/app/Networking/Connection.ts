/// <reference path="../../../../typings/socket.io/socket.io.d.ts"/>

import socketIO = require('socket.io');

export class Connection {
  private socket: SocketIO.Server;

  constructor() {
    this.socket = socketIO();

    this.socket.emit("ping", "new networking with proper socket!!");
  }
}
