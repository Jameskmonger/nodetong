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
    game.setCarData(player_id, undefined);
  });

  socket.on("player update", function(player_data) {
    game.setCarData(player_data.id, player_data);
  });

  var last_sent_player;

  function updatePlayer() {
    var player = game.getLocalPlayer();

    if (player === undefined) {
      return;
    }

    var data = {
      wheel: player.rotation.wheel,
      speed: player.speed
    };

    if (last_sent_player === data) {
      return;
    }

    last_sent_player = data;

    //socket.emit("update player", data);
  }
});
