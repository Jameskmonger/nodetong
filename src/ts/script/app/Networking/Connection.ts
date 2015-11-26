/// <reference path="../../../../typings/socket.io/socket.io.d.ts"/>

import socketIO = require('socket.io');
import { IPacket } from './Packet/Packets';

export class Connection {
  static instance: Connection;

  private socket: SocketIO.Server;

  constructor() {
    if (Connection.instance !== undefined) {
      throw new Error("A connection instance has already been constructed. Use Connection.get()");
    }

    this.socket = socketIO();

    Connection.instance = this;
  }

  sendPacket(packet: IPacket) {
    this.socket.emit(packet.event, packet.payload);
  }

  static get() {
    if (Connection.instance === undefined) {
      Connection.instance = new Connection();
    }

    return Connection.instance;
  }
}
