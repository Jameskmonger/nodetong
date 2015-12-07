define(["require", "exports"], function (require, exports) {
    var Player = (function () {
        function Player(id, name) {
            this.id = id;
            this.name = name;
            this.rotation = {
                vehicle: 90.0,
                wheel: 90.0
            };
        }
        Player.prototype.turnWheelRight = function () {
            this.setWheelRotation(this.getWheelRotation() + Player.WHEEL_TURN_INCREMENT);
        };
        Player.prototype.turnWheelLeft = function () {
            this.setWheelRotation(this.getWheelRotation() - Player.WHEEL_TURN_INCREMENT);
        };
        Player.prototype.getWheelRotation = function () {
            return this.rotation.wheel;
        };
        Player.prototype.setWheelRotation = function (value) {
            if (value > Player.LEFT_TURN_MAX && value < Player.RIGHT_TURN_MAX) {
                this.rotation.wheel = value;
            }
        };
        Player.WHEEL_TURN_INCREMENT = 2.5;
        Player.LEFT_TURN_MAX = 40;
        Player.RIGHT_TURN_MAX = 140;
        return Player;
    })();
    exports.Player = Player;
});
