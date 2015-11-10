if (typeof define !== 'function') {
  var define = require('amdefine')(module);
}

define(function () {
    "use strict";

    function Vector(x, y) {
        if (!(this instanceof Vector)) {
            throw new TypeError("Vector constructor cannot be called as a function.");
        }

        this.x = x;
        this.y = y;
    }

    Vector.prototype = {
    	constructor: Vector,

      addVector: function (vec) {
        if (!(vec instanceof Vector)) {
            throw new TypeError("addVector requires vec to be a Vector.");
        }

        var new_x = (this.x + vec.x);
        var new_y = (this.y + vec.y);

        return new Vector(new_x, new_y);
      },

      subtractVector: function (vec) {
        if (!(vec instanceof Vector)) {
            throw new TypeError("addVector requires vec to be a Vector.");
        }

        var new_x = (this.x - vec.x);
        var new_y = (this.y - vec.y);

        return new Vector(new_x, new_y);
      },

      multiplyScalar: function (scalar) {
        var new_x = (this.x * scalar);
        var new_y = (this.y * scalar);

        return new Vector(new_x, new_y);
      },

      magnitude: function() {
       return Math.sqrt(this.x * this.x + this.y * this.y);
      },
    };

    return Vector;
});
