define(["require", "exports"], function (require, exports) {
    var NicknameInputPacket = (function () {
        function NicknameInputPacket(nickname) {
            this.event = "nickname_input";
            this.payload = { nickname: nickname };
        }
        return NicknameInputPacket;
    })();
    exports.NicknameInputPacket = NicknameInputPacket;
    var SetWheelRotationPacket = (function () {
        function SetWheelRotationPacket(wheelRotation) {
            this.event = "set_wheel_rotation";
            this.payload = { wheelRotation: wheelRotation };
        }
        return SetWheelRotationPacket;
    })();
    exports.SetWheelRotationPacket = SetWheelRotationPacket;
    var SetEngineForcePacket = (function () {
        function SetEngineForcePacket(engineForce) {
            this.event = "set_engine_force";
            this.payload = { engineForce: engineForce };
        }
        return SetEngineForcePacket;
    })();
    exports.SetEngineForcePacket = SetEngineForcePacket;
    var SetBrakingForcePacket = (function () {
        function SetBrakingForcePacket(brakingForce) {
            this.event = "set_braking_force";
            this.payload = { brakingForce: brakingForce };
        }
        return SetBrakingForcePacket;
    })();
    exports.SetBrakingForcePacket = SetBrakingForcePacket;
});
