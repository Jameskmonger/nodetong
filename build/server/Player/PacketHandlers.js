var PingPacketHandler = (function () {
    function PingPacketHandler() {
        this.event = "ping";
    }
    PingPacketHandler.prototype.handler = function (payload) {
        console.log("PingPacketHandler received: " + payload);
    };
    return PingPacketHandler;
})();
exports.PingPacketHandler = PingPacketHandler;
