/// <reference path="./PacketHandlers.ts"/>

import PacketHandlers = require('./PacketHandlers');
import { GameState } from "./GameState";

export class Player {
  private listeners: Array<any>;
  private name: string = "Player";
  private state: GameState = GameState.CONNECTED;

  constructor(public id: number, private socket: any) {
    this.listeners = [];

    socket.on('disconnect', function() {
      this.notifyEventListeners(PlayerEvent.DISCONNECT);
  	}.bind(this));
  }

  getState(): GameState {
    return this.state;
  }

  getName() {
    return this.name;
  }

  setName(name: string) {
    if (this.state === GameState.NAMED) {
      throw new Error("The Player has already been named.");
    }

    if (this.state === GameState.CONNECTED) {
      this.state = GameState.NAMED;
      this.name = name;
    }

    console.log("The player is now called " + this.name);
  }

  registerPacketHandler(packet: PacketHandlers.IPacketHandler) {
    this.socket.on(packet.event, function(data) {
      packet.handler(this, data);
    }.bind(this));
  }

  registerEventListener(evt: PlayerEvent, listener: any) {
    if (this.listeners[evt] === undefined) {
      this.listeners[evt] = [];
    }

    this.listeners[evt].push(listener);
  }

  notifyEventListeners(evt: PlayerEvent) {
    this.listeners[evt].forEach(e => e(this));
  }
}

export enum PlayerEvent {
  DISCONNECT
}
