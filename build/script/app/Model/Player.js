define(["require", "exports"], function (require, exports) {
    var Player = (function () {
        function Player(id, name) {
            this.id = id;
            this.name = name;
        }
        return Player;
    })();
    exports.Player = Player;
});
