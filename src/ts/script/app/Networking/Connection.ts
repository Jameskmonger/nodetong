/// <reference path="../../../../typings/socket.io/socket.io.d.ts"/>

import socketIO = require('socket.io');
import Packets = require('./Packet/Packets');

export class Connection {
  static instance: Connection;

  private socket: SocketIO.Server;

  constructor() {
    if (Connection.instance !== undefined) {
      throw new Error("A connection instance has already been constructed. Use Connection.get()");
    }

    this.socket = socketIO();

    this.sendPacket(new Packets.PingPacket("new networking with packets!"));

    Connection.instance = this;
  }

  sendPacket(packet: Packets.IPacket) {
    this.socket.emit(packet.event, packet.payload);
  }

  static get() {
    if (Connection.instance === undefined) {
      Connection.instance = new Connection();
    }

    return Connection.instance;
  }
}
