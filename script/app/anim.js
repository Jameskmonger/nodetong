define(['./game', 'domReady'], function (game) {
  window.onresize = resized;

  loaded();

  var drawing;

  var scale = 1.4;

  var wheel_width = 5 * scale, wheel_length = 11 * scale;
  var car_width = 21 * scale, car_height = 25 * scale;
  var wheel_base = car_height + wheel_length / 4;

  function loaded() {
    var world_canvas = document.getElementById('world_canvas');
    var player_canvas = document.getElementById('players_canvas');

    drawing = {
      world: {
        canvas: world_canvas,
        context: world_canvas.getContext('2d')
      },
      players: {
        canvas: player_canvas,
        context: player_canvas.getContext('2d')
      }
    };

    resized();

    loadVehicleImages();

    requestAnimationFrame(draw);
  }

  function resized() {
    drawing.world.canvas.width = window.innerWidth;
    drawing.world.canvas.height = window.innerHeight;
    drawing.players.canvas.width = window.innerWidth;
    drawing.players.canvas.height = window.innerHeight;
  }

  function getGearText() {
    switch (game.player_gear) {
      case -1:
        return "R";
      case 0:
        return "N";
      case 1:
        return "1";
    }

    return "N";
  }

  var PRELOAD_VEHICLE_MODEL_COUNT = 5, PRELOAD_VEHICLE_COLOR_COUNT = 5;

  var vehicle_images = new Array();

  function getVehicleImage(id, color) {
    return loadVehicleImage(id, color);
  }

  function loadVehicleImages() {
    for (var m = 0; m < PRELOAD_VEHICLE_MODEL_COUNT; m++) {
      vehicle_images[m] = new Array();

      for (var c = 0; c < PRELOAD_VEHICLE_COLOR_COUNT; c++) {
        vehicle_images[m][c] = new Image();
        vehicle_images[m][c].src = getVehicleImageSrc(m, c);
      }
    }
  }

  function getVehicleImageSrc(model, color) {
    return ('/assets/vehicles/' + model + '_' + color + '.png');
  }

  function loadVehicleImage(model, color) {
    if (vehicle_images[model] == undefined) {
      vehicle_images[model] = new Array();
    }

    vehicle_images[model][color] = new Image();
    vehicle_images[model][color].src = getVehicleImageSrc(model, color);

    return vehicle_images[model][color];
  }

  function getPositionRotationRad(car) {
    return (car.position.rotation.car_deg) * (Math.PI/180);
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
    var local_car = game.getLocalPlayer();

    if (local_car != undefined) {
      var local_car_x = local_car.position.x;
      var local_car_y = local_car.position.y;

      var origin_x = drawing.world.canvas.width / 2;
      var origin_y = drawing.world.canvas.height / 2;

      // Clear the canvas so we can draw again
      drawing.world.context.clearRect(0, 0, drawing.world.canvas.width, drawing.world.canvas.height);

      drawing.world.context.save();
      drawing.world.context.fillStyle = "#333333"
      drawing.world.context.fillRect(0, 0, drawing.world.canvas.width, drawing.world.canvas.height);
      drawing.world.context.restore();

      var base = game.BASE_TILE_IMAGE;

      for (var y = 0; y < game.WORLD_DIMENSIONS.HEIGHT; y++) {
        for (var x = 0; x < game.WORLD_DIMENSIONS.WIDTH; x++) {
          var img = game.getWorldTile(x, y);

          // Get image offset compared to local player
          var image_x = (img.width * x) + origin_x - local_car_x;
          var image_y = (img.height * y) + origin_y - local_car_y;

          if (base != img) {
              drawing.world.context.drawImage(base, image_x, image_y);
          }

          drawing.world.context.drawImage(img, image_x, image_y);
        }
      }

      drawing.players.context.clearRect(0, 0, drawing.world.canvas.width, drawing.world.canvas.height);

      _.forEach(game.car_array, function(car) {
        if (car != undefined) {
          drawCar(car);
        }
      });

      //drawGearInformation();
    }

    requestAnimationFrame(draw);

    function drawGearInformation() {
      drawing.players.context.save();
      drawing.players.context.font = "42px Arial";
      drawing.players.context.fillStyle = "#ffffff";
      drawing.players.context.fillText(getGearText(), 25, drawing.players.canvas.height - 25);
      drawing.players.context.restore();
    }

    function drawCar(car) {
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

      front_wheel_rotation = car.position.rotation.wheel_deg;
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

      var line_y = car_pos_y - 20;

      drawing.players.context.fillText("id: " + car.id, car_pos_x + car_width, line_y);
      line_y += 20;

      /*
      drawing.players.context.fillText("draw_x: " + car_pos_x.toFixed(2), car_pos_x + car_width, line_y);
      line_y += 15;

      drawing.players.context.fillText("draw_y: " + car_pos_y.toFixed(2), car_pos_x + car_width, line_y);
      line_y += 20;

      drawing.players.context.fillText("pos_x: " + car.position.x.toFixed(2), car_pos_x + car_width, line_y);
      line_y += 15;

      drawing.players.context.fillText("pos_y: " + car.position.y.toFixed(2), car_pos_x + car_width, line_y);
      line_y += 20;
      */

      drawing.players.context.fillText("speed: " + car.speed.toFixed(1), car_pos_x + car_width, line_y);
      line_y += 15;

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
