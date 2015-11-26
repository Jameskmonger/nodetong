var PacketHandlers = require("./Player/PacketHandlers");
var Player_1 = require("./Player/Player");
var Packets = require("./Networking/Packets");
var GameServer = (function () {
    function GameServer(io) {
        this.io = io;
        this.MAX_PLAYER_COUNT = 20;
        this.playerList = [];
        if (GameServer.instance !== undefined) {
            throw new Error("A connection instance has already been constructed. Use Connection.get()");
        }
        GameServer.instance = this;
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
    GameServer.get = function (io) {
        if (io === void 0) { io = undefined; }
        if (GameServer.instance === undefined) {
            if (io === undefined) {
                throw new Error("IO must be specified if creating a new GameServer instance via get()");
            }
            GameServer.instance = new GameServer(io);
        }
        return GameServer.instance;
    };
    GameServer.prototype.acceptPlayer = function (player) {
        if (this.isPlayerStored(player)) {
            player.sendPacket(new Packets.LocalPlayerIndexPacket(player.id));
            this.playerList.forEach(function (otherPlayer) {
                player.sendPacket(new Packets.AddPlayerPacket(otherPlayer));
            });
        }
    };
    GameServer.prototype.isPlayerStored = function (player) {
        return (this.playerList.indexOf(player) !== -1);
    };
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
