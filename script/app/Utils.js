if (typeof define !== 'function') {
  var define = require('amdefine')(module);
}

define(function () {
    "use strict";

  // Converts from degrees to radians.
  Math.radians = function(degrees) {
    return degrees * Math.PI / 180;
  };

  // Converts from radians to degrees.
  Math.degrees = function(radians) {
    return radians * 180 / Math.PI;
  };

  Number.prototype.betweenEquals = function (min, max) {
      return (this >= min && this <= max);
  };

  Number.prototype.closeTo = function (value, range) {
    var half_range = (range / 2);
    var lower_bound = (value - half_range);
    var upper_bound = (value + half_range);

    return (this.betweenEquals(lower_bound, upper_bound));
  };
});
