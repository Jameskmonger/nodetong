if (typeof define !== 'function') {
  var define = require('amdefine')(module);
}

define(function () {
    "use strict";

    function Vector(obj) {
        if (!(this instanceof Vector)) {
            throw new TypeError("Vector constructor cannot be called as a function.");
        }

        this.x = 0;
        this.y = 0;

        for (var prop in obj) this[prop] = obj[prop];
    }

    Vector.prototype = {
    	constructor: Vector,

      addVector: function (vec) {
        if (!(vec instanceof Vector)) {
            throw new TypeError("addVector requires vec to be a Vector.");
        }

        var new_x = (this.x + vec.x);
        var new_y = (this.y + vec.y);

        return new Vector({x: new_x, y: new_y});
      },

      subtractVector: function (vec) {
        if (!(vec instanceof Vector)) {
            throw new TypeError("addVector requires vec to be a Vector.");
        }

        var new_x = (this.x - vec.x);
        var new_y = (this.y - vec.y);

        return new Vector({x: new_x, y: new_y});
      },

      multiplyScalar: function (scalar) {
        var new_x = (this.x * scalar);
        var new_y = (this.y * scalar);

        return new Vector({x: new_x, y: new_y});
      },

      magnitude: function() {
       return Math.sqrt(this.x * this.x + this.y * this.y);
      },
    };

    return Vector;
});
