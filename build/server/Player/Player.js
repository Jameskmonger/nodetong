var Player = (function () {
    function Player(id, name, socket) {
        this.id = id;
        this.name = name;
        this.socket = socket;
        this.listeners = [];
        socket.on('disconnect', function () {
            this.notifyEventListeners(Event.DISCONNECT);
        }.bind(this));
    }
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
(function (Event) {
    Event[Event["DISCONNECT"] = 0] = "DISCONNECT";
})(exports.Event || (exports.Event = {}));
var Event = exports.Event;
