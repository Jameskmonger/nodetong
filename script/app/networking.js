define(['./game'], function (game) {
  var UPDATE_LOOP_INTERVAL = 100;

  var socket;

  loaded();

  function loaded() {
    socket = io({reconnection: false});

    setInterval(update_loop, UPDATE_LOOP_INTERVAL);
  }

  socket.on("local player id", function(id) {
    game.setLocalPlayerId(id);
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

  function update_loop() {
    socket.emit("update player", game.getLocalPlayer());
  }
});
