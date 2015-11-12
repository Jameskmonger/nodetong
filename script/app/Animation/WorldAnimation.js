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

      drawing.world.context.save();
      drawing.world.context.font = "20px Arial";
      drawing.world.context.fillStyle = "yellow";
      drawing.world.context.fillText("FPS: " + this.parent.getFps().toFixed(0), 25, 45);
      drawing.world.context.restore();
    }
  };

  return WorldAnimation;
});
