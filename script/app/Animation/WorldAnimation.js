define(function (require) {
  "use strict";

  function WorldAnimation(parent) {
    this.parent = parent;
  }

  WorldAnimation.prototype = {
    constructor: WorldAnimation,

    draw: function () {
      var drawing = this.parent.getDrawingDetails();

      drawing.world.context.save();
      drawing.world.context.fillStyle = "#333333"
      drawing.world.context.fillRect(0, 0, drawing.world.canvas.width, drawing.world.canvas.height);
      drawing.world.context.restore();

      var local_player = this.parent.game.getLocalPlayer();

      if (local_player !== undefined) {
        var local_car = local_player.getVehicle();

        var local_car_x = local_car.position.x;
        var local_car_y = local_car.position.y;

        var origin_x = drawing.world.canvas.width / 2;
        var origin_y = drawing.world.canvas.height / 2;

        if (this.parent.world_loaded) {
          drawing.world.context.clearRect(0, 0, drawing.world.canvas.width, drawing.world.canvas.height);

          drawing.world.context.drawImage(drawing.world_dummy.canvas, 0 + origin_x - local_car_x, 0 + origin_y - local_car_y);

          drawing.players.context.clearRect(0, 0, drawing.world.canvas.width, drawing.world.canvas.height);
        }
      }

      drawing.world.context.save();
      drawing.world.context.font = "20px Arial";
      drawing.world.context.fillStyle = "yellow";
      drawing.world.context.fillText("FPS: " + this.parent.getFps().toFixed(0), 25, 45);
      drawing.world.context.restore();
    }
  };

  return WorldAnimation;
});
