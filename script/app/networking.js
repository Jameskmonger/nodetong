define(function (require) {
  "use strict";

  function Networking(game) {
    this.socket = io({reconnection: false});

    this.parent = game;
    this.parent.setMovementListener(this.updatePlayer.bind(this));

    this.socket.on("initialise local player", function(data) {
      if (this.parent !== undefined) {
        this.parent.getWorld().setData(data.world);
        this.parent.setLocalPlayerId(data.id);
      }
    }.bind(this));

    this.socket.on("player join", function(player_data) {
      if (this.parent !== undefined) {
        this.parent.setCarData(player_data.id, player_data);
      }
    }.bind(this));

    this.socket.on("player leave", function(player_id) {
      if (this.parent !== undefined) {
        this.parent.removePlayer(player_id);
      }
    }.bind(this));

    this.socket.on("player update", function(player_data) {
      if (this.parent !== undefined) {
        this.parent.setCarData(player_data.id, player_data);
      }
    }.bind(this));
  }

  Networking.prototype = {
    constructor: Networking,

    updatePlayer: function () {
      var game = this.parent;

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

      this.socket.emit("update player", data);
    }
  };

  return Networking;
});
