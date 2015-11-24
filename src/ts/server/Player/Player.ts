/// <reference path="./PacketHandlers.ts"/>

import PacketHandlers = require('./PacketHandlers');

export class Player {
  private listeners: Array<any>;

  constructor(public id: number, public name: string, private socket: any) {
    this.listeners = [];

    socket.on('disconnect', function() {
      this.notifyEventListeners(Event.DISCONNECT);
  	}.bind(this));
  }

  registerPacketHandler(packet: PacketHandlers.IPacketHandler) {
    this.socket.on(packet.event, packet.handler);
  }

  registerEventListener(evt: Event, listener: any) {
    if (this.listeners[evt] === undefined) {
      this.listeners[evt] = [];
    }

    this.listeners[evt].push(listener);
  }

  notifyEventListeners(evt: Event) {
    this.listeners[evt].forEach(e => e(this));
  }
}

export enum Event {
  DISCONNECT
}
