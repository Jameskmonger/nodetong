define(["require", "exports"], function (require, exports) {
    var PingPacket = (function () {
        function PingPacket(message) {
            this.event = "ping";
            this.payload = message;
        }
        return PingPacket;
    })();
    exports.PingPacket = PingPacket;
    var NicknameInputPacket = (function () {
        function NicknameInputPacket(nickname) {
            this.event = "nickname_input";
            this.payload = nickname;
        }
        return NicknameInputPacket;
    })();
    exports.NicknameInputPacket = NicknameInputPacket;
});
