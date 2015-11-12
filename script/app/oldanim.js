define(['./game', 'domReady'], function (game) {
  window.onresize = resized;

  loaded();

  var world_loaded;

  var drawing;

  var scale = 1.4;

  var wheel_width = 5 * scale, wheel_length = 11 * scale;
  var car_width = 21 * scale, car_height = 25 * scale;
  var wheel_base = car_height + wheel_length / 4;

  var lastCalledTime, fps;

  function getPositionRotationRad(car) {
    return (car.rotation.vehicle) * (Math.PI/180);
  }

  function getWorldPositionForScreenCoordinates(x, y) {
    var origin_x = drawing.world.canvas.width / 2;
    var origin_y = drawing.world.canvas.height / 2;

    var local_player = getLocalPlayer();

    var world_x = local_player.position.x + (x - origin_x);
    var world_y = local_player.position.y + (y - origin_y);

    return {
      x: world_x,
      y: world_y
    };
  }

  function draw() {
    if(lastCalledTime === 0) {
      lastCalledTime = Date.now();
      fps = 0;

      requestAnimationFrame(draw);
      return;
    }

    delta = (new Date().getTime() - lastCalledTime)/1000;
    lastCalledTime = Date.now();
    fps = 1/delta;

    if (game.getLocalPlayer() === undefined) {
      requestAnimationFrame(draw);
      return;
    }

    var local_car = game.getLocalPlayer().getVehicle();

    if (local_car !== undefined) {
      var local_car_x = local_car.position.x;
      var local_car_y = local_car.position.y;

      var origin_x = drawing.world.canvas.width / 2;
      var origin_y = drawing.world.canvas.height / 2;

      if (world_loaded) {
        drawing.world.context.clearRect(0, 0, drawing.world.canvas.width, drawing.world.canvas.height);

        drawing.world.context.drawImage(drawing.world_dummy.canvas, 0 + origin_x - local_car_x, 0 + origin_y - local_car_y);

        drawing.players.context.clearRect(0, 0, drawing.world.canvas.width, drawing.world.canvas.height);

        _.forEach(game.getPlayerArray(), function(player) {
          if (player !== undefined && player.getVehicle() !== undefined) {
            drawPlayer(player);
          }
        });
      }

    }

    requestAnimationFrame(draw);

    function drawPlayer(player) {
      var car = player.getVehicle();

      // http://engineeringdotnet.blogspot.co.uk/2010/04/simple-2d-car-physics-in-games.html

      var car_pos_x = car.position.x + origin_x - local_car_x;
      var car_pos_y = car.position.y + origin_y - local_car_y;

      drawing.players.context.save();

      drawing.players.context.translate(car_pos_x, car_pos_y);
      drawing.players.context.rotate(getPositionRotationRad(car));
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

      drawRotatedRect(drawing.players.context, front_left_wheel_x, front_left_wheel_y, wheel_length, wheel_width, front_wheel_rotation);
      drawRotatedRect(drawing.players.context, front_right_wheel_x, front_right_wheel_y, wheel_length, wheel_width, front_wheel_rotation);

      drawRotatedRect(drawing.players.context, back_left_wheel_x, back_left_wheel_y, wheel_length, wheel_width, back_wheel_rotation);
      drawRotatedRect(drawing.players.context, back_right_wheel_x, back_right_wheel_y, wheel_length, wheel_width, back_wheel_rotation);

      drawing.players.context.save();

      var car_img = getVehicleImage(car.model, car.color);
      if (car_img != undefined) {
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

    function drawRotatedRect(ctx, x, y, width, height, rotation) {
      ctx.save();
      ctx.translate(x + width / 2, y + height / 2);
      ctx.rotate(rotation * Math.PI / 180);
      ctx.fillRect(-width / 2, -height / 2, width, height);
      ctx.restore();
    }
  }
});
