define(["require", "exports", "../../Model/Player", "../../Screen/LoginScreen", "../../Screen/GameScreen"], function (require, exports, Player_1, LoginScreen_1, GameScreen_1) {
    var LocalPlayerIndexPacketHandler = (function () {
        function LocalPlayerIndexPacketHandler(_tong) {
            this._tong = _tong;
            this.event = "local_player_index";
        }
        LocalPlayerIndexPacketHandler.prototype.handler = function (payload) {
            this._tong.localPlayerIndex = payload.localPlayerIndex;
            this._tong.hide(LoginScreen_1.LoginScreen.get());
            var game_screen = GameScreen_1.GameScreen.get(this._tong, document);
            this._tong.show(game_screen);
        };
        return LocalPlayerIndexPacketHandler;
    })();
    exports.LocalPlayerIndexPacketHandler = LocalPlayerIndexPacketHandler;
    var AddPlayerPacketHandler = (function () {
        function AddPlayerPacketHandler(_tong) {
            this._tong = _tong;
            this.event = "add_player";
        }
        AddPlayerPacketHandler.prototype.handler = function (payload) {
            var player = new Player_1.Player(payload.player.id, payload.player.name);
            this._tong.registerPlayer(player);
        };
        return AddPlayerPacketHandler;
    })();
    exports.AddPlayerPacketHandler = AddPlayerPacketHandler;
    var RemovePlayerPacketHandler = (function () {
        function RemovePlayerPacketHandler(_tong) {
            this._tong = _tong;
            this.event = "remove_player";
        }
        RemovePlayerPacketHandler.prototype.handler = function (payload) {
            this._tong.deregisterPlayer(payload.player.id);
        };
        return RemovePlayerPacketHandler;
    })();
    exports.RemovePlayerPacketHandler = RemovePlayerPacketHandler;
    var SetPlayerVehicleSkinPacketHandler = (function () {
        function SetPlayerVehicleSkinPacketHandler(_tong) {
            this._tong = _tong;
            this.event = "set_player_vehicle_skin";
        }
        SetPlayerVehicleSkinPacketHandler.prototype.handler = function (payload) {
            console.log("implement me");
        };
        return SetPlayerVehicleSkinPacketHandler;
    })();
    exports.SetPlayerVehicleSkinPacketHandler = SetPlayerVehicleSkinPacketHandler;
    var SetPlayerVehicleModelPacketHandler = (function () {
        function SetPlayerVehicleModelPacketHandler(_tong) {
            this._tong = _tong;
            this.event = "set_player_vehicle_model";
        }
        SetPlayerVehicleModelPacketHandler.prototype.handler = function (payload) {
            console.log("implement me");
        };
        return SetPlayerVehicleModelPacketHandler;
    })();
    exports.SetPlayerVehicleModelPacketHandler = SetPlayerVehicleModelPacketHandler;
    var SetPlayerVehiclePositionPacketHandler = (function () {
        function SetPlayerVehiclePositionPacketHandler(_tong) {
            this._tong = _tong;
            this.event = "set_player_vehicle_position";
        }
        SetPlayerVehiclePositionPacketHandler.prototype.handler = function (payload) {
            console.log("implement me");
        };
        return SetPlayerVehiclePositionPacketHandler;
    })();
    exports.SetPlayerVehiclePositionPacketHandler = SetPlayerVehiclePositionPacketHandler;
    var SetPlayerVehicleRotationPacketHandler = (function () {
        function SetPlayerVehicleRotationPacketHandler(_tong) {
            this._tong = _tong;
            this.event = "set_player_vehicle_rotation";
        }
        SetPlayerVehicleRotationPacketHandler.prototype.handler = function (payload) {
            console.log("implement me");
        };
        return SetPlayerVehicleRotationPacketHandler;
    })();
    exports.SetPlayerVehicleRotationPacketHandler = SetPlayerVehicleRotationPacketHandler;
    var SetPlayerWheelPositionPacketHandler = (function () {
        function SetPlayerWheelPositionPacketHandler(_tong) {
            this._tong = _tong;
            this.event = "set_player_wheel_position";
        }
        SetPlayerWheelPositionPacketHandler.prototype.handler = function (payload) {
            console.log("implement me");
        };
        return SetPlayerWheelPositionPacketHandler;
    })();
    exports.SetPlayerWheelPositionPacketHandler = SetPlayerWheelPositionPacketHandler;
    var SetPlayerSpeedPacketHandler = (function () {
        function SetPlayerSpeedPacketHandler(_tong) {
            this._tong = _tong;
            this.event = "set_player_speed";
        }
        SetPlayerSpeedPacketHandler.prototype.handler = function (payload) {
            console.log("implement me");
        };
        return SetPlayerSpeedPacketHandler;
    })();
    exports.SetPlayerSpeedPacketHandler = SetPlayerSpeedPacketHandler;
});
