define(['./Networking/OutboundNetworking', './Networking/InboundNetworking'], function (OutboundNetworking, InboundNetworking) {
  "use strict";

  function Networking(game) {
    this.socket = io({reconnection: false});

    this.game = game;

    new OutboundNetworking(this);
    new InboundNetworking(this);
  }

  Networking.prototype = {
    constructor: Networking,

    getGame: function () {
      return this.game;
    },

    getSocket: function() {
      return this.socket;
    }
  };

  return Networking;
});
