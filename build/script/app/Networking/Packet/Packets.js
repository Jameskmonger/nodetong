define(["require", "exports"], function (require, exports) {
    var PingPacket = (function () {
        function PingPacket(message) {
            this.event = "ping";
            this.payload = message;
        }
        return PingPacket;
    })();
    exports.PingPacket = PingPacket;
});
