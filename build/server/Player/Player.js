var GameState_1 = require("./GameState");
var Player = (function () {
    function Player(id, socket) {
        this.id = id;
        this.socket = socket;
        this.name = "Player";
        this.state = GameState_1.GameState.CONNECTED;
        this.listeners = [];
        socket.on('disconnect', function () {
            this.notifyEventListeners(PlayerEvent.DISCONNECT);
        }.bind(this));
    }
    Player.prototype.getState = function () {
        return this.state;
    };
    Player.prototype.getName = function () {
        return this.name;
    };
    Player.prototype.setName = function (name) {
        if (this.state === GameState_1.GameState.NAMED) {
            throw new Error("The Player has already been named.");
        }
        if (this.state === GameState_1.GameState.CONNECTED) {
            this.state = GameState_1.GameState.NAMED;
            this.name = name;
        }
        console.log("The player is now called " + this.name);
    };
    Player.prototype.registerPacketHandler = function (packet) {
        this.socket.on(packet.event, function (data) {
            packet.handler(this, data);
        }.bind(this));
    };
    Player.prototype.registerEventListener = function (evt, listener) {
        if (this.listeners[evt] === undefined) {
            this.listeners[evt] = [];
        }
        this.listeners[evt].push(listener);
    };
    Player.prototype.notifyEventListeners = function (evt) {
        var _this = this;
        this.listeners[evt].forEach(function (e) { return e(_this); });
    };
    return Player;
})();
exports.Player = Player;
(function (PlayerEvent) {
    PlayerEvent[PlayerEvent["DISCONNECT"] = 0] = "DISCONNECT";
})(exports.PlayerEvent || (exports.PlayerEvent = {}));
var PlayerEvent = exports.PlayerEvent;
