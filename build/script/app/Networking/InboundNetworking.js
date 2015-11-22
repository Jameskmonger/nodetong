define(function (require) {
  "use strict";

  function InboundNetworking(master_networking) {
    this.master_networking = master_networking;

    var socket = this.master_networking.getSocket();
    var game = this.master_networking.getGame();

    socket.on("initialise local player", function(data) {
      if (game !== undefined) {
        game.getWorld().setData(data.world);
        game.setLocalPlayerId(data.id);
      }
    }.bind(this));

    socket.on("player join", function(player_data) {
      if (game !== undefined) {
        game.setCarData(player_data.id, player_data);
      }
    }.bind(this));

    socket.on("player leave", function(player_id) {
      if (game !== undefined) {
        game.removePlayer(player_id);
      }
    }.bind(this));

    socket.on("player update", function(player_data) {
      if (game !== undefined) {
        game.setCarData(player_data.id, player_data);
      }
    }.bind(this));
  }

  InboundNetworking.prototype = {
    constructor: InboundNetworking,
  };

  return InboundNetworking;
});
