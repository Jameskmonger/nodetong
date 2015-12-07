define(["require", "exports", "./Login/LoginScreenObserver", "./Screen/LoginScreen", "./Networking/Packet/PacketHandlers", "./Networking/Connection", "./KeyHandler/KeyHandler"], function (require, exports, LoginScreenObserver_1, LoginScreen_1, PacketHandlers, Connection_1, KeyHandler_1) {
    var Tong = (function () {
        function Tong(doc) {
            this.doc = doc;
            this.GAME_LOOP_INTERVAL = 25;
            this._keyHandler = KeyHandler_1.KeyHandler.get();
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
        Tong.prototype._loop = function () {
            console.log("game loop");
            if (this._keyHandler.isKeyPressed(KeyHandler_1.KeyHandler.KeyCodes.LEFT)) {
                this.playerArray[this.localPlayerIndex].turnWheelLeft();
            }
            else if (this._keyHandler.isKeyPressed(KeyHandler_1.KeyHandler.KeyCodes.RIGHT)) {
                this.playerArray[this.localPlayerIndex].turnWheelRight();
            }
        };
        Tong.prototype.startGameLoop = function () {
            setInterval(this._loop, 25);
        };
        Tong.prototype.getPlayers = function () {
            return this.playerArray;
        };
        Tong.prototype.registerPlayer = function (player) {
            this.playerArray[player.id] = player;
        };
        Tong.prototype.deregisterPlayer = function (playerId) {
            this.playerArray.splice(playerId, 1);
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
