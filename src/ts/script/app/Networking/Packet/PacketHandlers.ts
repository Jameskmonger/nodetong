export interface IPacketHandler {
   event: string;
   handler: (payload: any) => void;
}

export class LocalPlayerIndexPacketHandler implements IPacketHandler {
   event = "local_player_index";
   handler (payload: number) {
   }
}
