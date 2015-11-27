var LocalPlayerIndexPacket = (function () {
    function LocalPlayerIndexPacket(localPlayerIndex) {
        this.event = "local_player_index";
        this.payload = { localPlayerIndex: localPlayerIndex };
    }
    return LocalPlayerIndexPacket;
})();
exports.LocalPlayerIndexPacket = LocalPlayerIndexPacket;
var AddPlayerPacket = (function () {
    function AddPlayerPacket(player) {
        this.event = "add_player";
        this.payload = {
            player: {
                id: player.id,
                name: player.getName()
            }
        };
    }
    return AddPlayerPacket;
})();
exports.AddPlayerPacket = AddPlayerPacket;
var RemovePlayerPacket = (function () {
    function RemovePlayerPacket(player) {
        this.event = "remove_player";
        this.payload = {
            player: {
                id: player.id
            }
        };
    }
    return RemovePlayerPacket;
})();
exports.RemovePlayerPacket = RemovePlayerPacket;
var SetPlayerVehicleSkinPacket = (function () {
    function SetPlayerVehicleSkinPacket(player) {
        this.event = "set_player_vehicle_skin";
        this.payload = {
            player: {
                id: player.id,
                skinId: player.skinId
            }
        };
    }
    return SetPlayerVehicleSkinPacket;
})();
exports.SetPlayerVehicleSkinPacket = SetPlayerVehicleSkinPacket;
var SetPlayerVehicleModelPacket = (function () {
    function SetPlayerVehicleModelPacket(player) {
        this.event = "set_player_vehicle_model";
        this.payload = {
            player: {
                id: player.id,
                modelId: player.modelId
            },
        };
    }
    return SetPlayerVehicleModelPacket;
})();
exports.SetPlayerVehicleModelPacket = SetPlayerVehicleModelPacket;
var SetPlayerVehiclePositionPacket = (function () {
    function SetPlayerVehiclePositionPacket(player, xCoordinate, yCoordinate) {
        this.event = "set_player_vehicle_position";
        this.payload = {
            player: {
                id: player.id
            },
            position: {
                x: xCoordinate,
                y: yCoordinate
            }
        };
    }
    return SetPlayerVehiclePositionPacket;
})();
exports.SetPlayerVehiclePositionPacket = SetPlayerVehiclePositionPacket;
var SetPlayerVehicleRotationPacket = (function () {
    function SetPlayerVehicleRotationPacket(player, vehicleRotation) {
        this.event = "set_player_vehicle_position";
        this.payload = {
            player: {
                id: player.id
            },
            vehicleRotation: vehicleRotation
        };
    }
    return SetPlayerVehicleRotationPacket;
})();
exports.SetPlayerVehicleRotationPacket = SetPlayerVehicleRotationPacket;
var SetPlayerWheelRotationPacket = (function () {
    function SetPlayerWheelRotationPacket(player, wheelRotation) {
        this.event = "set_player_wheel_position";
        this.payload = {
            player: {
                id: player.id
            },
            wheelRotation: wheelRotation
        };
    }
    return SetPlayerWheelRotationPacket;
})();
exports.SetPlayerWheelRotationPacket = SetPlayerWheelRotationPacket;
var SetPlayerSpeedPacket = (function () {
    function SetPlayerSpeedPacket(player, speed) {
        this.event = "set_player_speed";
        this.payload = {
            player: {
                id: player.id
            },
            speed: speed
        };
    }
    return SetPlayerSpeedPacket;
})();
exports.SetPlayerSpeedPacket = SetPlayerSpeedPacket;
