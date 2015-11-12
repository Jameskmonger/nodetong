define(function (require) {
  "use strict";

  function World() {
    this.WORLD_HEIGHT_TILE = 0;
    this.WORLD_WIDTH_TILE = 0;

    this.world_tiles = [];

    this.BASE_TILE_ID = 0;
    this.BASE_TILE_IMAGE = undefined;

    this.track_tile_images = [];
  }

  World.prototype = {
    constructor: World,

    setLoadListener: function (listener) {
      this.loaded_listener = listener;
    },

    setData: function (world_data) {
      this.WORLD_HEIGHT_TILE = world_data.height;
      this.WORLD_WIDTH_TILE = world_data.width;
      this.BASE_TILE_ID = world_data.base;

      this.world_tiles = [];

      // Define an array of x tiles for each y tile
      for (var w = 0; w < this.WORLD_WIDTH_TILE; w++) {
        this.world_tiles[w] = [];
      }

      this.BASE_TILE_IMAGE = this.getTrackTileImage(this.BASE_TILE_ID);

      for (var x = 0; x < this.WORLD_WIDTH_TILE; x++) {
        for (var y = 0; y < this.WORLD_HEIGHT_TILE; y++) {
          if (world_data.tiles[x][y] !== undefined) {
            this.world_tiles[x][y] = this.getTrackTileImage(world_data.tiles[x][y]);
          }
        }
      }

      if (this.loaded_listener !== undefined) {
        this.loaded_listener();
      }
    },

    getTrackTileImage: function (id) {
      if (id === null) {
        return this.BASE_TILE_IMAGE;
      }

      if (this.track_tile_images[id] === undefined) {
        this.track_tile_images[id] = new Image();
        this.track_tile_images[id].src = '/assets/tiles/' + id + '.png';
      }

      return this.track_tile_images[id];
    },

    getBaseTile: function () {
      return this.BASE_TILE_IMAGE;
    },

    getDimensions: function() {
      return {
        HEIGHT: this.WORLD_HEIGHT_TILE,
        WIDTH: this.WORLD_WIDTH_TILE
      };
    },

    getTile: function (x, y) {
      if (this.world_tiles[x][y] === undefined || this.world_tiles[x][y] === null) {
        return this.getTrackTileImage(this.BASE_TILE_ID);
      } else {
        return this.world_tiles[x][y];
      }
    }
  };

  return World;
});
