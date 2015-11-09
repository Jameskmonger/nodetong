define(function () {
    "use strict";

    var LEFT_TURN_MAX = 40, RIGHT_TURN_MAX = 140;
    var WHEEL_TURN_INCREMENT = 2.5, WHEEL_STRAIGHTEN_INCREMENT = 4.0;

    var scale = 1.4;

    var wheel_width = 5 * scale, wheel_length = 11 * scale;
    var car_width = 21 * scale, car_height = 25 * scale;
    var wheel_base = car_height + wheel_length / 4;

    function Vehicle() {
      this.position = {
        x: 0,
        y: 0,
        rotation: {
          wheel_deg: 90.0,
          car_deg: 90.0
        }
      };

      this.color = 0;
      this.model = 0;
    }

    Vehicle.prototype = {
      constructor: Vehicle,

      setPosition: function (x, y) {
        this.position.x = x;
        this.position.y = y;
      },

      getWheelRotation: function() {
        return this.position.rotation.wheel_deg;
      },

      setWheelRotation: function (value) {
        if (value <= LEFT_TURN_MAX) {
          return;
        }

        if (value >= RIGHT_TURN_MAX) {
          return;
        }

        this.position.rotation.wheel_deg = value;
        return;
      },

      turnWheelRight: function (listener) {
        this.setWheelRotation(this.getWheelRotation() + WHEEL_TURN_INCREMENT);

        listener();
        return;
      },

      turnWheelLeft: function (listener) {
        this.setWheelRotation(this.getWheelRotation() - WHEEL_TURN_INCREMENT);

        listener()
        return;
      },

      straightenWheel: function (listener) {
        var original_rotation = this.getWheelRotation();

        var new_rotation;

        if (original_rotation > 90.0) {
          var delta = (original_rotation - 90.0);

          if (delta <= WHEEL_STRAIGHTEN_INCREMENT) {
            new_rotation = 90.0;
          } else {
            new_rotation = (original_rotation - WHEEL_STRAIGHTEN_INCREMENT);
          }
        } else {
          var delta = (90.0 - original_rotation);

          if (delta <= WHEEL_STRAIGHTEN_INCREMENT) {
            new_rotation = 90.0;
          } else {
            new_rotation = (original_rotation + WHEEL_STRAIGHTEN_INCREMENT);
          }
        }

        this.setWheelRotation(new_rotation);

        listener();
      },
    };

    return Vehicle;
});
