define(function (require) {
  "use strict";

  function World() {

  }

  World.prototype = {
    constructor: World,

    setLoadListener: function (listener) {
      this.loaded_listener = listener;
    },

    setWorldTiles: function (world_data) {
      this.WORLD_HEIGHT_TILE = world_data.height;
      this.WORLD_WIDTH_TILE = world_data.width;
      this.BASE_TILE_ID = world_data.base;

      this.world_tiles = [];

      // Define an array of x tiles for each y tile
      for (var w = 0; w < WORLD_WIDTH_TILE; w++) {
        this.world_tiles[w] = [];
      }

      this.BASE_TILE_IMAGE = getTrackTileImage(BASE_TILE_ID);

      for (var x = 0; x < WORLD_WIDTH_TILE; x++) {
        for (var y = 0; y < WORLD_HEIGHT_TILE; y++) {
          if (world_data.tiles[x][y] !== undefined) {
            this.world_tiles[x][y] = getTrackTileImage(world_data.tiles[x][y]);
          }
        }
      }

      if (this.loaded_listener !== undefined) {
        world_loaded_listener();
      }
    }
  };

  return World;
});
