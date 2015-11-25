define(["require", "exports", "../Networking/Packet/Packets", "../Networking/Connection"], function (require, exports, Packets, Connection) {
    var LoginScreenObserver = (function () {
        function LoginScreenObserver() {
        }
        LoginScreenObserver.prototype.observed = function (event) {
            Connection.Connection.get().sendPacket(new Packets.NicknameInputPacket(event.getNickname()));
        };
        return LoginScreenObserver;
    })();
    exports.LoginScreenObserver = LoginScreenObserver;
});
