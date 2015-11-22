import Player = require('./Player/Player');

export class GameServer {
  private MAX_PLAYER_COUNT: number = 20;
  private playerList: Array<Player.Player> = [];

  constructor(private io: any) {
    io.sockets.on('connection', function(socket) {
      var id: number = this.getEmptyPlayerIndex();

      // If the ID is -1, then there are no more player slots.
      // We need more handling here (error message to the player).
      if (id === -1) {
        return;
      }

      var name: string = GameServer.getRandomName();

      var player: Player.Player = new Player.Player(id, name, socket);

      player.registerEventListener(Player.Event.DISCONNECT, this.removePlayer.bind(this));

      this.storePlayer(player);
    }.bind(this));
  }

  storePlayer(player: Player.Player) {
    this.playerList[player.id] = player;
  }

  removePlayer(player: Player.Player) {
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

  static getRandomName() {
    var NAMES = ["Boris", "Oscar", "Giovanni", "Patrick", "Derek", "Quentin", "Quagmire", "Milton", "Glen", "Hubert"];

    return NAMES[GameServer.getRandomInt(0, NAMES.length - 1)];
  }
}
