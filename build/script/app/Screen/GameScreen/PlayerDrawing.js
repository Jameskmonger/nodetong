define(["require", "exports"], function (require, exports) {
    var PlayerDrawing = (function () {
        function PlayerDrawing() {
        }
        PlayerDrawing.draw = function (tong, drawingDetails) {
            var local_car = tong.getPlayers()[tong.localPlayerIndex];
            var local_car_x = local_car.positionX;
            var local_car_y = local_car.positionY;
            var origin_x = drawingDetails.canvas.width / 2;
            var origin_y = drawingDetails.canvas.height / 2;
            var CAR_IMAGE_SCALE = 48.0;
            tong.getPlayers().forEach(function (player) {
                if (player !== undefined) {
                    var car_img = PlayerDrawing.getVehicleImage(player.modelId, player.skinId);
                    if (car_img !== undefined) {
                        drawingDetails.context.drawImage(car_img, player.positionX, player.positionY, CAR_IMAGE_SCALE, CAR_IMAGE_SCALE * (121 / 70));
                    }
                }
            });
        };
        PlayerDrawing.getVehicleImage = function (model, color) {
            if (this.vehicle_images === undefined) {
                this.vehicle_images = [];
            }
            if (this.vehicle_images[model] === undefined) {
                this.vehicle_images[model] = Array();
            }
            this.vehicle_images[model][color] = new Image();
            this.vehicle_images[model][color].src = this.getVehicleImageSrc(model, color);
            return this.vehicle_images[model][color];
        };
        PlayerDrawing.getVehicleImageSrc = function (model, color) {
            return ('/assets/vehicles/' + model + '_' + color + '.png');
        };
        return PlayerDrawing;
    })();
    exports.PlayerDrawing = PlayerDrawing;
});
