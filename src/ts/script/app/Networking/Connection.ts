/// <reference path="../../../../typings/socket.io/socket.io.d.ts"/>

import socketIO = require('socket.io');
import Packets = require('./Packet/Packets');

export class Connection {
  private socket: SocketIO.Server;

  constructor() {
    this.socket = socketIO();

    this.sendPacket(new Packets.PingPacket("new networking with packets!"));
  }

  sendPacket(packet: Packets.IPacket) {
    this.socket.emit(packet.event, packet.payload);
  }
}
