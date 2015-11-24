export interface IPacket {
  event: string;
  payload: any;
}

export class PingPacket implements IPacket {
  event = "ping";
  payload: any;

  constructor(message) {
    this.payload = message;
  }
}
