define(function (require) {
  "use strict";

  function OutboundNetworking(master_networking) {
    this.master_networking = master_networking;

    this.master_networking.getGame().setMovementListener(this.updateLocalPlayer.bind(this));
  }

  OutboundNetworking.prototype = {
    constructor: OutboundNetworking,

    updateLocalPlayer: function () {
      var game = this.master_networking.getGame();

      if (game === undefined) {
        return;
      }

      if (game.getLocalPlayer() === undefined) {
        return;
      }

      var player = game.getLocalPlayer().getVehicle();

      var data = {
        wheel: player.rotation.wheel,
        speed: player.speed,
        force: {
          engine: player.engine_power,
          braking: player.braking_force
        }
      };

      if (this.last_sent_player !== undefined) {
        if (this.last_sent_player.wheel === data.wheel &&
            this.last_sent_player.speed === data.speed &&
            this.last_sent_player.force.engine === data.force.engine &&
            this.last_sent_player.force.braking === data.force.braking) {
          return;
        }
      }

      this.last_sent_player = data;

      this.master_networking.getSocket().emit("update player", data);
    }
  };

  return OutboundNetworking;
});
