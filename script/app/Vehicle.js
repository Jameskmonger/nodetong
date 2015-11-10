if (typeof define !== 'function') {
  var define = require('amdefine')(module);
}

define(['./Vector', './Utils'], function (Vector, Utils) {
    "use strict";

    var LEFT_TURN_MAX = 40, RIGHT_TURN_MAX = 140;
    var WHEEL_TURN_INCREMENT = 2.5, WHEEL_STRAIGHTEN_INCREMENT = 4.0;

    var FRICTION_COEFFICIENT = 0.30, CAR_MASS = 1000, CAR_FRONTAL_AREA = 2.2, AIR_DENSITY = 1.29;
    var DRAG_CONSTANT = 0.5 * FRICTION_COEFFICIENT * CAR_FRONTAL_AREA * AIR_DENSITY;

    var DRAG_ROLLING_RESISTANCE = 30 * DRAG_CONSTANT;

    var scale = 1.4;

    var wheel_width = 5 * scale, wheel_length = 11 * scale;
    var car_width = 21 * scale, car_height = 25 * scale;
    var wheel_base = car_height + wheel_length / 4;

    function Vehicle() {
      this.position = new Vector({x: 0, y: 0});

      this.rotation = {
        vehicle: 90.0,
        wheel: 90.0
      };

      this.color = 0;
      this.model = 0;

      this.engine_power = 0.0;
      this.braking_force = 0.0;
      this.speed = 0.0;
    }

    Vehicle.prototype = {
      constructor: Vehicle,

      setPosition: function (x, y) {
        this.position = new Vector({x: x, y: y});
      },

      setVehicleRotation: function (deg) {
        this.rotation.vehicle = deg;
      },

      getWheelRotation: function () {
        return this.rotation.wheel;
      },

      setWheelRotation: function (value) {
        if (value <= LEFT_TURN_MAX) {
          return;
        }

        if (value >= RIGHT_TURN_MAX) {
          return;
        }

        this.rotation.wheel = value;
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

      setEnginePower: function (value) {
        this.engine_power = value;
      },

      setBrakingForce: function (value) {
        this.braking_force = value;
      },

      processMovement: function () {
        var dt = 1.0;

        var rads = Math.radians(this.rotation.vehicle - 90);

        var wheel_base_offset = new Vector({x: ((wheel_base / 2) * Math.cos(rads)), y: ((wheel_base / 2) * Math.sin(rads))});

        var front_wheels = new Vector({x: this.position.x, y: this.position.y}).addVector(wheel_base_offset);
        var back_wheels = new Vector({x: this.position.x, y: this.position.y}).subtractVector(wheel_base_offset);

        var force_traction = this.engine_power;

        if (this.speed > 0.1)
        {
          force_traction -= this.braking_force;
        } else if (this.braking_force > 10.0) {
          this.speed = 0.0;
          force_traction = 0.0
        }

        var force_drag = this.speed * (DRAG_CONSTANT * -1);

        var force_rolling_res = this.speed * (DRAG_ROLLING_RESISTANCE * -1);

        var forwards_force = force_traction + force_drag + force_rolling_res;

        var acceleration = forwards_force / CAR_MASS;

        this.speed = this.speed + (dt * acceleration);

        var wheel_rads = Math.radians(this.rotation.wheel - 90);

        var front_wheel_movement = new Vector({x: Math.cos(rads + wheel_rads), y: Math.sin(rads + wheel_rads)}).multiplyScalar(this.speed);

        front_wheels = front_wheels.addVector(front_wheel_movement);

        var back_wheel_movement = new Vector({x: Math.cos(rads), y: Math.sin(rads)}).multiplyScalar(this.speed);

        back_wheels = back_wheels.addVector(back_wheel_movement);

        this.position = front_wheels.addVector(back_wheels).multiplyScalar(1 / 2);

        this.rotation.vehicle = Math.degrees(Math.atan2(front_wheels.y - back_wheels.y, front_wheels.x - back_wheels.x)) + 90;
      }
    };

    return Vehicle;
});
