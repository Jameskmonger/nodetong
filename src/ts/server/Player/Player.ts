/// <reference path="./PacketHandlers.ts"/>

import { IPacket } from "../Networking/Packets.ts";
import PacketHandlers = require('./PacketHandlers');
import { GameState } from "./GameState";
import { GameServer } from "../GameServer";

export class Player {
  private listeners: Array<any>;
  private name: string = "Player";
  private state: GameState = GameState.CONNECTED;
  public modelId: number;
  public skinId: number;

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

      GameServer.get().acceptPlayer(this);

      console.log("The player is now called " + this.name);
    }
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

  sendPacket(packet: IPacket) {
     this.socket.emit(packet.event, packet.payload);
 }
}

export enum PlayerEvent {
  DISCONNECT
}
