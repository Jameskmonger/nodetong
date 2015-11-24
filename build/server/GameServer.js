var Player = require('./Player/Player');
var GameServer = (function () {
    function GameServer(io) {
        this.io = io;
        this.MAX_PLAYER_COUNT = 20;
        this.playerList = [];
        io.sockets.on('connection', function (socket) {
            var id = this.getEmptyPlayerIndex();
            if (id === -1) {
                return;
            }
            var name = GameServer.getRandomName();
            var player = new Player.Player(id, name, socket);
            player.registerEventListener(Player.Event.DISCONNECT, this.removePlayer.bind(this));
            this.storePlayer(player);
        }.bind(this));
    }
    GameServer.prototype.storePlayer = function (player) {
        this.playerList[player.id] = player;
    };
    GameServer.prototype.removePlayer = function (player) {
        this.playerList[player.id] = undefined;
    };
    GameServer.prototype.getEmptyPlayerIndex = function () {
        for (var i = 0; i < this.MAX_PLAYER_COUNT; i++) {
            if (this.playerList[i] === undefined) {
                return i;
            }
        }
        return -1;
    };
    GameServer.getRandomInt = function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };
    GameServer.getRandomName = function () {
        var NAMES = ["Boris", "Oscar", "Giovanni", "Patrick", "Derek", "Quentin", "Quagmire", "Milton", "Glen", "Hubert"];
        return NAMES[GameServer.getRandomInt(0, NAMES.length - 1)];
    };
    return GameServer;
})();
exports.GameServer = GameServer;
