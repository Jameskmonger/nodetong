import { Tong } from "../../Tong";
import { Player } from "../../Model/Player";

export class PlayerDrawing {
  static vehicle_images: Array<Array<HTMLImageElement>>;

  static draw(tong: Tong, drawingDetails: any) {
    var local_car = tong.getPlayers()[tong.localPlayerIndex];

    var local_car_x = local_car.positionX;
    var local_car_y = local_car.positionY;

    var origin_x = drawingDetails.canvas.width / 2;
    var origin_y = drawingDetails.canvas.height / 2;

    var CAR_IMAGE_SCALE = 48.0;

    tong.getPlayers().forEach((player: Player) => {
      if (player !== undefined) {
        var car_img = PlayerDrawing.getVehicleImage(player.modelId, player.skinId);

        if (car_img !== undefined) {
          (<CanvasRenderingContext2D>drawingDetails.context).drawImage(car_img, player.positionX + origin_x - local_car_x, player.positionY + origin_y - local_car_y, CAR_IMAGE_SCALE, CAR_IMAGE_SCALE * (121 / 70));
        }
      }
    });
  }

  static getVehicleImage(model, color) {
    if (this.vehicle_images === undefined) {
      this.vehicle_images = [];
    }

    if (this.vehicle_images[model] === undefined) {
      this.vehicle_images[model] = Array<HTMLImageElement>();
    }

    this.vehicle_images[model][color] = new Image();
    this.vehicle_images[model][color].src = this.getVehicleImageSrc(model, color);

    return this.vehicle_images[model][color];
  }

  static getVehicleImageSrc(model, color) {
    return ('/assets/vehicles/' + model + '_' + color + '.png');
  }
}
