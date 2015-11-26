define(["require", "exports"], function (require, exports) {
    var LocalPlayerIndexPacketHandler = (function () {
        function LocalPlayerIndexPacketHandler() {
            this.event = "local_player_index";
        }
        LocalPlayerIndexPacketHandler.prototype.handler = function (payload) {
        };
        return LocalPlayerIndexPacketHandler;
    })();
    exports.LocalPlayerIndexPacketHandler = LocalPlayerIndexPacketHandler;
});
