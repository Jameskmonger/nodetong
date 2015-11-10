if (typeof define !== 'function') {
  var define = require('amdefine')(module);
}

define(['./script/app/Vehicle'], function (Vehicle) {

  function Player(id, name) {
    this._id = id;
    this._name = name;
    this._vehicle = new Vehicle();
  }

  Player.prototype = {
    constructor: Player,

    getVehicle: function () {
      return this._vehicle;
    },
  };

  return Player;
});
