define(function (require) {
  "use strict";

  var scale = 1.4;

  var wheel_width = 5 * scale, wheel_length = 11 * scale;
  var car_width = 21 * scale, car_height = 25 * scale;
  var wheel_base = car_height + wheel_length / 4;

  function PlayerAnimation(parent) {
    this.parent = parent;
  }

  PlayerAnimation.prototype = {
    constructor: PlayerAnimation,

    draw: function () {
      var drawing = this.parent.getDrawingDetails();

      this.local_car = this.parent.game.getLocalPlayer().getVehicle();

      this.local_car_x = this.local_car.position.x;
      this.local_car_y = this.local_car.position.y;

      this.origin_x = drawing.world.canvas.width / 2;
      this.origin_y = drawing.world.canvas.height / 2;

      _.forEach(this.parent.game.getPlayerArray(), function(player) {
        if (player !== undefined && player.getVehicle() !== undefined) {
          this.drawPlayer(player, drawing);
        }
      }.bind(this));
    },

    drawPlayer: function (player, drawing) {
      var origin_x = this.origin_x;
      var origin_y = this.origin_y;
      var local_car_x = this.local_car_x;
      var local_car_y = this.local_car_y;

      var car = player.getVehicle();

      // http://engineeringdotnet.blogspot.co.uk/2010/04/simple-2d-car-physics-in-games.html

      var car_pos_x = car.position.x + origin_x - local_car_x;
      var car_pos_y = car.position.y + origin_y - local_car_y;

      drawing.players.context.save();

      drawing.players.context.translate(car_pos_x, car_pos_y);
      drawing.players.context.rotate(Math.radians(car.rotation.vehicle));
      drawing.players.context.translate(-(car_pos_x), -(car_pos_y));

      var front_left_wheel_x = (car_pos_x - car_width + wheel_width);
      var front_left_wheel_y = (car_pos_y - car_height + wheel_length) - 1;

      var front_right_wheel_x = front_left_wheel_x + car_width;
      var front_right_wheel_y = front_left_wheel_y;

      var back_left_wheel_x = (car_pos_x - car_width + wheel_width);
      var back_left_wheel_y = (car_pos_y + wheel_length) - 1;

      var back_right_wheel_x = back_left_wheel_x + car_width;
      var back_right_wheel_y = back_left_wheel_y;

      var front_wheel_rotation = 90;
      var back_wheel_rotation = 90;

      front_wheel_rotation = car.rotation.wheel;
      back_wheel_rotation = 90;

      this.parent.drawRotatedRect(drawing.players.context, front_left_wheel_x, front_left_wheel_y, wheel_length, wheel_width, front_wheel_rotation);
      this.parent.drawRotatedRect(drawing.players.context, front_right_wheel_x, front_right_wheel_y, wheel_length, wheel_width, front_wheel_rotation);

      this.parent.drawRotatedRect(drawing.players.context, back_left_wheel_x, back_left_wheel_y, wheel_length, wheel_width, back_wheel_rotation);
      this.parent.drawRotatedRect(drawing.players.context, back_right_wheel_x, back_right_wheel_y, wheel_length, wheel_width, back_wheel_rotation);

      drawing.players.context.save();

      var car_img = this.parent.getVehicleImage(car.model, car.color);
      if (car_img !== undefined) {
        drawing.players.context.drawImage(car_img, car_pos_x - (car_width * 0.6), car_pos_y - (car_height * 0.8), car_width * 1.2, car_height * 1.6);
      }

      drawing.players.context.restore();

      drawing.players.context.save();
      drawing.players.context.font = "bold 20px Arial";
      drawing.players.context.fillStyle = "#222222";
      drawing.players.context.textAlign = 'center';

      drawing.players.context.translate(car_pos_x, car_pos_y);
      drawing.players.context.rotate(Math.radians(270));
      drawing.players.context.translate(-(car_pos_x), -(car_pos_y));

      drawing.players.context.fillText(player.getName(), car_pos_x, car_pos_y - car_height * 0.8);
      drawing.players.context.restore();

      drawing.players.context.restore();
    }
  };

  return PlayerAnimation;
});
