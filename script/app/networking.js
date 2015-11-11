define(['./game'], function (game) {
  var socket;

  loaded();

  function loaded() {
    socket = io({reconnection: false});

    game.setMovementListener(updatePlayer);
  }

  socket.on("initialise local player", function(data) {
    game.setWorldTiles(data.world);
    game.setLocalPlayerId(data.id);
  });

  socket.on("player join", function(player_data) {
    game.setCarData(player_data.id, player_data);
  });

  socket.on("player leave", function(player_id) {
    game.removePlayer(player_id);
  });

  socket.on("player update", function(player_data) {
    game.setCarData(player_data.id, player_data);
  });

  var last_sent_player;

  function updatePlayer() {
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

    if (last_sent_player !== undefined) {
      if (last_sent_player.wheel === data.wheel &&
          last_sent_player.speed === data.speed &&
          last_sent_player.force.engine === data.force.engine &&
          last_sent_player.force.braking === data.force.braking) {
        return;
      }
    }

    last_sent_player = data;

    socket.emit("update player", data);
  }
});
