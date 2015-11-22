if (typeof define !== 'function') {
  var define = require('amdefine')(module);
}

define(['./Vehicle'], function (Vehicle) {

  function Player(obj) {
    this._vehicle = new Vehicle();

    for (var prop in obj) {
      this[prop] = obj[prop];
    }
  }

  Player.prototype = {
    constructor: Player,

    getVehicle: function () {
      return this._vehicle;
    },

    getName: function() {
      return this.name;
    },
  };

  return Player;
});
