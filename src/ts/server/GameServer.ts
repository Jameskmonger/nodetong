import PacketHandlers = require("./Player/PacketHandlers");
import { Player, PlayerEvent } from "./Player/Player";
import { GameState } from "./Player/GameState";
import Packets = require("./Networking/Packets");

export class GameServer {
  static instance: GameServer;

  private MAX_PLAYER_COUNT: number = 20;
  private playerList: Array<Player> = [];

  constructor(private io: any) {
    if (GameServer.instance !== undefined) {
      throw new Error("A connection instance has already been constructed. Use Connection.get()");
    }

    GameServer.instance = this;

    io.sockets.on('connection', function(socket) {
      var id: number = GameServer.get().getEmptyPlayerIndex();

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

  public static get(io: any = undefined) {
    if (GameServer.instance === undefined) {
      if (io === undefined) {
        throw new Error("IO must be specified if creating a new GameServer instance via get()");
      }

      GameServer.instance = new GameServer(io);
    }

    return GameServer.instance;
  }

  acceptPlayer(player: Player) {
    if (this.isPlayerStored(player)) {
      player.sendPacket(new Packets.LocalPlayerIndexPacket(player.id));

      this.playerList.forEach((otherPlayer) => {
        /*
         * Send all initialised players to the new player,
         * send the new player to all initialised players apart from itself.
         */

        if (otherPlayer.getState() === GameState.NAMED) {
          player.sendPacket(new Packets.AddPlayerPacket(otherPlayer));
          if (otherPlayer !== player) {
            otherPlayer.sendPacket(new Packets.AddPlayerPacket(player));
           }
        }
      });
    }
  }

  isPlayerStored(player: Player): boolean {
    // If the index of the player in the list is not -1, then they're stored
    return (this.playerList.indexOf(player) !== -1);
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
