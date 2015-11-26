import PacketHandlers = require("./Player/PacketHandlers");
import { Player, PlayerEvent } from "./Player/Player";

export class GameServer {
  private MAX_PLAYER_COUNT: number = 20;
  private playerList: Array<Player> = [];

  constructor(private io: any) {
    io.sockets.on('connection', function(socket) {
      var id: number = this.getEmptyPlayerIndex();

      // If the ID is -1, then there are no more player slots.
      // We need more handling here (error message to the player).
      if (id === -1) {
        return;
      }

      var player: Player = new Player(id, socket);

      player.registerEventListener(PlayerEvent.DISCONNECT, this.removePlayer.bind(this));

      player.registerPacketHandler(new PacketHandlers.NicknameInputHandler());

      this.storePlayer(player);
    }.bind(this));
  }

  storePlayer(player: Player) {
    this.playerList[player.id] = player;
  }

  removePlayer(player: Player) {
    this.playerList[player.id] = undefined;
  }

  getEmptyPlayerIndex() {
    for (var i = 0; i < this.MAX_PLAYER_COUNT; i++) {
      if (this.playerList[i] === undefined) {
        return i;
      }
    }

    return -1;
  }

  static getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
