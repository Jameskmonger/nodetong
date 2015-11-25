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
var NicknameInputHandler = (function () {
    function NicknameInputHandler() {
        this.event = "nickname_input";
    }
    NicknameInputHandler.prototype.handler = function (receiver, payload) {
        console.log("NicknameInputHandler received '" + payload + "'");
    };
    return NicknameInputHandler;
})();
exports.NicknameInputHandler = NicknameInputHandler;
