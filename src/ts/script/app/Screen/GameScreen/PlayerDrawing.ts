import { Tong } from "../../Tong";
import { Player } from "../../Model/Player";

export class PlayerDrawing {
  static draw(tong: Tong, drawingDetails: any) {
    tong.getPlayers().forEach((player: Player) => {
      console.log("i am trying to draw a player called " + player.name);
    });
  }
}
