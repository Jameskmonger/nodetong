define(['./request_animation_frame', './Animation/WorldAnimation', './Animation/PlayerAnimation'], function (requestAnimationFrame, WorldAnimation, PlayerAnimation) {

  function Animation(game) {
    window.onresize = this.resized.bind(this);

    this.game = game;

    this.game.getWorld().setLoadListener(this.worldLoaded.bind(this));

    var world_canvas = document.getElementById('world_canvas');
    var player_canvas = document.getElementById('players_canvas');

    var dummy = document.createElement("canvas");
    dummy.width = 0;
    dummy.height = 0;

    this.drawing = {
      world: {
        canvas: world_canvas,
        context: world_canvas.getContext('2d')
      },
      players: {
        canvas: player_canvas,
        context: player_canvas.getContext('2d')
      },
      world_dummy: {
        canvas: dummy,
        context: dummy.getContext('2d')
      }
    };

    this.lastCalledTime = 0;
    this.fps = 0;

    this.resized();

    this.PRELOAD_VEHICLE_MODEL_COUNT = 5;
    this.PRELOAD_VEHICLE_COLOR_COUNT = 5;
    this.vehicle_images = [];

    this.loadVehicleImages();

    this.world_loaded = false;

    this.world_animation = new WorldAnimation(this);
    this.player_animation = new PlayerAnimation(this);

    window.requestAnimationFrame(this.draw.bind(this));
  }

  Animation.prototype = {
    constructor: Animation,

    isWorldLoaded: function () {
      return this.world_loaded;
    },

    drawRotatedRect: function (ctx, x, y, width, height, rotation) {
      ctx.save();
      ctx.translate(x + width / 2, y + height / 2);
      ctx.rotate(rotation * Math.PI / 180);
      ctx.fillRect(-width / 2, -height / 2, width, height);
      ctx.restore();
    },

    getDrawingDetails: function () {
      return this.drawing;
    },

    getFps: function () {
      return this.fps;
    },

    getVehicleImage: function (model, color) {
      if (this.vehicle_images[model] === undefined) {
        this.vehicle_images[model] = [];
      }

      this.vehicle_images[model][color] = new Image();
      this.vehicle_images[model][color].src = this.getVehicleImageSrc(model, color);

      return this.vehicle_images[model][color];
    },

    loadVehicleImages: function () {
      for (var m = 0; m < this.PRELOAD_VEHICLE_MODEL_COUNT; m++) {
        this.vehicle_images[m] = [];

        for (var c = 0; c < this.PRELOAD_VEHICLE_COLOR_COUNT; c++) {
          this.vehicle_images[m][c] = new Image();
          this.vehicle_images[m][c].src = this.getVehicleImageSrc(m, c);
        }
      }
    },

    getVehicleImageSrc: function (model, color) {
      return ('/assets/vehicles/' + model + '_' + color + '.png');
    },

    resized: function () {
      this.drawing.world.canvas.width = window.innerWidth;
      this.drawing.world.canvas.height = window.innerHeight;
      this.drawing.players.canvas.width = window.innerWidth;
      this.drawing.players.canvas.height = window.innerHeight;
    },

    draw: function () {
      var drawing = this.drawing;

      if(this.lastCalledTime === 0) {
        this.lastCalledTime = Date.now();
        this.fps = 0;

        window.requestAnimationFrame(this.draw.bind(this));
        return;
      }

      var delta = (new Date().getTime() - this.lastCalledTime)/1000;
      this.lastCalledTime = Date.now();
      this.fps = 1 / delta;

      if (this.game.getLocalPlayer() === undefined) {
        window.requestAnimationFrame(this.draw.bind(this));
        return;
      }

      this.world_animation.draw();
      this.player_animation.draw();

      window.requestAnimationFrame(this.draw.bind(this));
    },

    worldLoaded: function () {
      var world = this.game.getWorld();
      var details = this.getDrawingDetails();

      if (details.world_dummy.canvas.width === 0) {
        details.world_dummy.canvas.width = world.getDimensions().WIDTH * 128;
      }

      if (details.world_dummy.canvas.height === 0) {
        details.world_dummy.canvas.height = world.getDimensions().HEIGHT * 128;
      }

      var GAME_WORLD_WIDTH = world.getDimensions().WIDTH,
          GAME_WORLD_HEIGHT = world.getDimensions().HEIGHT;

      var drawn_tiles = 0;

      var try_to_draw_interval = setInterval(function() {
        drawn_tiles = 0;

        var base = world.getBaseTile();

        for (var y = 0; y < GAME_WORLD_HEIGHT; y++) {
          for (var x = 0; x < GAME_WORLD_WIDTH; x++) {
            var img = world.getTile(x, y);

            var image_x = (128 * x);
            var image_y = (128 * y);

            if (base != img) {
                details.world_dummy.context.drawImage(base, image_x, image_y);
            }

            details.world_dummy.context.drawImage(img, image_x, image_y);

            if (img.complete) {
              drawn_tiles++;
            }
          }
        }

        if (drawn_tiles === (GAME_WORLD_WIDTH * GAME_WORLD_HEIGHT)) {
          this.world_loaded = true;

          clearInterval(try_to_draw_interval);
        }
      }.bind(this), 25);
    }
  };

  return Animation;
});
