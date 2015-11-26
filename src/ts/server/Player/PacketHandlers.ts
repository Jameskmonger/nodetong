import { Player } from "./Player";
import { GameState } from "./GameState";
export interface IPacketHandler {
  event: string;
  handler: (receiver: Player, payload: any) => any;
}

export class NicknameInputHandler implements IPacketHandler {
  event = "nickname_input";
  handler (receiver: Player, payload: any) {
    var nick:string = payload.nickname;

    // Check that the inputted name only contains letters, numbers or spaces
    var regex = /^[a-z,A-Z,0-9]([a-z,A-Z,0-9, ]*[a-z,A-Z,0-9])?$/

    // Check that the player is in the connected state
    if (regex.test(nick) && receiver.getState() === GameState.CONNECTED) {
      receiver.setName(nick);
    }
  }
}
