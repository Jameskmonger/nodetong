var PacketHandlers = require("./Player/PacketHandlers");
var Player_1 = require("./Player/Player");
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
            var player = new Player_1.Player(id, socket);
            player.registerEventListener(Player_1.PlayerEvent.DISCONNECT, this.removePlayer.bind(this));
            player.registerPacketHandler(new PacketHandlers.NicknameInputHandler());
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
    return GameServer;
})();
exports.GameServer = GameServer;
