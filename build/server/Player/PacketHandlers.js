var PingPacketHandler = (function () {
    function PingPacketHandler() {
        this.event = "ping";
    }
    PingPacketHandler.prototype.handler = function (receiver, payload) {
        console.log("PingPacketHandler received '" + receiver.name + "': " + payload);
    };
    return PingPacketHandler;
})();
exports.PingPacketHandler = PingPacketHandler;
