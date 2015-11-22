define(function (require) {
  "use strict";

  function FrictionMap(world, tiles) {
    this.world = world;

    var dims = world.getDimensions();

    var cnv = document.createElement("canvas");
    cnv.width = dims.WIDTH * 128;
    cnv.height = dims.HEIGHT * 128;

    this.canvas = cnv;
    this.context = cnv.getContext('2d');

    this.WORLD_WIDTH_TILE = dims.WIDTH;
    this.WORLD_HEIGHT_TILE = dims.HEIGHT;

    this.friction_map_images = [];

    this.world_tiles = [];
    this.world_tile_ids = [];

    for (var w = 0; w < this.WORLD_WIDTH_TILE; w++) {
      this.world_tiles[w] = [];
      this.world_tile_ids[w] = [];
    }

    for (var x = 0; x < this.WORLD_WIDTH_TILE; x++) {
      for (var y = 0; y < this.WORLD_HEIGHT_TILE; y++) {
        this.world_tiles[x][y] = this.getFrictionTileImage(tiles[x][y]);
        this.world_tile_ids[x][y] = tiles[x][y];
      }
    }
  }

  FrictionMap.prototype = {
    constructor: FrictionMap,

    drawTileImage: function (id) {
      for (var x = 0; x < this.WORLD_WIDTH_TILE; x++) {
        for (var y = 0; y < this.WORLD_HEIGHT_TILE; y++) {
          if (this.world_tile_ids[x][y] !== id) {
            continue;
          }

          var image_x = (128 * x);
          var image_y = (128 * y);

          this.context.drawImage(this.world_tiles[x][y], image_x, image_y);
        }
      }
    },

    getPositionColor: function (x, y) {
      return this.context.getImageData(x, y, 1, 1).data[0];
    },

    getFrictionTile: function (x, y) {
      return this.world_tiles[x][y];
    },

    getFrictionTileImage: function (id) {
      if (id === null || id === undefined) {
        id = 9007199254740991;
      }

      if (this.friction_map_images[id] === undefined) {
        this.friction_map_images[id] = new Image();
        this.friction_map_images[id].src = '/assets/friction_maps/' + id + '.png';
        this.friction_map_images[id].onload = function() {
          this.drawTileImage(id);
        }.bind(this);
      }

      return this.friction_map_images[id];
    }
  };

  return FrictionMap;
});
