define(["require", "exports"], function (require, exports) {
    var WorldDrawing = (function () {
        function WorldDrawing() {
        }
        WorldDrawing.draw = function (canvas) {
            for (var y = 0; y < this.GAME_WORLD_HEIGHT; y++) {
                for (var x = 0; x < this.GAME_WORLD_WIDTH; x++) {
                    var img = this.getTrackTileImage(3);
                    var image_x = (128 * x);
                    var image_y = (128 * y);
                    canvas.getContext("2d").drawImage(img, image_x, image_y);
                }
            }
        };
        WorldDrawing.getTrackTileImage = function (id) {
            if (id === null) {
                return this.BASE_TILE_IMAGE;
            }
            if (this.track_tile_images[id] === undefined) {
                this.track_tile_images[id] = new Image();
                this.track_tile_images[id].src = '/assets/tiles/' + id + '.png';
            }
            return this.track_tile_images[id];
        };
        WorldDrawing.track_tile_images = [];
        WorldDrawing.GAME_WORLD_HEIGHT = 30;
        WorldDrawing.GAME_WORLD_WIDTH = 30;
        return WorldDrawing;
    })();
    exports.WorldDrawing = WorldDrawing;
});
