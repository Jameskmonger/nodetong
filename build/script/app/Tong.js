define(["require", "exports", "./Login/LoginScreenObserver", "./Screen/LoginScreen", "./Networking/Packet/PacketHandlers", "./Networking/Connection"], function (require, exports, LoginScreenObserver_1, LoginScreen_1, PacketHandlers, Connection_1) {
    var Tong = (function () {
        function Tong(doc) {
            this.doc = doc;
            this.playerArray = [];
        }
        Tong.prototype.show = function (screen) {
            this.doc.getElementById(screen.id).style.display = "block";
            screen.onShow();
        };
        Tong.prototype.hide = function (screen) {
            this.doc.getElementById(screen.id).style.display = "none";
            screen.onHide();
        };
        Tong.prototype.registerPlayer = function (player) {
            this.playerArray.push(player);
        };
        return Tong;
    })();
    exports.Tong = Tong;
    var tong = new Tong(document);
    Connection_1.Connection.get().addHandler(new PacketHandlers.LocalPlayerIndexPacketHandler(tong));
    Connection_1.Connection.get().addHandler(new PacketHandlers.AddPlayerPacketHandler(tong));
    Connection_1.Connection.get().addHandler(new PacketHandlers.RemovePlayerPacketHandler(tong));
    Connection_1.Connection.get().addHandler(new PacketHandlers.SetPlayerVehicleSkinPacketHandler(tong));
    Connection_1.Connection.get().addHandler(new PacketHandlers.SetPlayerVehicleModelPacketHandler(tong));
    Connection_1.Connection.get().addHandler(new PacketHandlers.SetPlayerVehiclePositionPacketHandler(tong));
    Connection_1.Connection.get().addHandler(new PacketHandlers.SetPlayerVehicleRotationPacketHandler(tong));
    Connection_1.Connection.get().addHandler(new PacketHandlers.SetPlayerWheelPositionPacketHandler(tong));
    Connection_1.Connection.get().addHandler(new PacketHandlers.SetPlayerSpeedPacketHandler(tong));
    var login_screen = LoginScreen_1.LoginScreen.get(document);
    login_screen.observe(new LoginScreenObserver_1.LoginScreenObserver());
    tong.show(login_screen);
});
