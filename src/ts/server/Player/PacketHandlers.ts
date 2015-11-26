import Player = require("./Player");
export interface IPacketHandler {
  event: string;
  handler: (receiver: Player.Player, payload: any) => any;
}

export class NicknameInputHandler implements IPacketHandler {
  event = "nickname_input";
  handler (receiver: Player.Player, payload: string) {
    console.log("NicknameInputHandler received '" + payload + "'");
  }
}
