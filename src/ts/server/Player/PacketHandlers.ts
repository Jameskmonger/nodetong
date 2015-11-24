export interface IPacketHandler {
  event: string;
  handler: (payload: any) => any;
}

export class PingPacketHandler implements IPacketHandler {
  event = "ping";
  handler (payload: string) {
    console.log("PingPacketHandler received: " + payload);
  }
}
