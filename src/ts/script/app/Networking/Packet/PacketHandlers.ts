import { Tong } from "../../Tong";
import { Player } from "../../Model/Player";

export interface IPacketHandler {
   event: string;
   handler: (payload: any) => void;
}

export class LocalPlayerIndexPacketHandler implements IPacketHandler {
   event = "local_player_index";

   public constructor (private _tong: Tong) {
   }

   handler (payload: any): void {
      this._tong.localPlayerIndex = payload.localPlayerIndex;
   }
}

export class AddPlayerPacketHandler implements IPacketHandler {
   event = "add_player";

   public constructor (private _tong: Tong) {
   }

   handler (payload: any): void {
     var player: Player = new Player(payload.player.id, payload.player.name);
     this._tong.registerPlayer(player);
   }
}

export class RemovePlayerPacketHandler implements IPacketHandler {
   event = "remove_player";

   public constructor (private _tong: Tong) {
   }

   handler (payload: any): void {
      console.log("implement me");
   }
}

export class SetPlayerVehicleSkinPacketHandler implements IPacketHandler {
   event = "set_player_vehicle_skin";

   public constructor (private _tong: Tong) {
   }

   handler (payload: any): void {
      console.log("implement me");
   }
}

export class SetPlayerVehicleModelPacketHandler implements IPacketHandler {
   event = "set_player_vehicle_model";

   public constructor (private _tong: Tong) {
   }

   handler (payload: any): void {
      console.log("implement me");
   }
}

export class SetPlayerVehiclePositionPacketHandler implements IPacketHandler {
   event = "set_player_vehicle_position";

   public constructor (private _tong: Tong) {
   }

   handler (payload: any): void {
      console.log("implement me");
   }
}

export class SetPlayerVehicleRotationPacketHandler implements IPacketHandler {
   event = "set_player_vehicle_rotation";

   public constructor (private _tong: Tong) {
   }

   handler (payload: any): void {
      console.log("implement me");
   }
}

export class SetPlayerWheelPositionPacketHandler implements IPacketHandler {
   event = "set_player_wheel_position";

   public constructor (private _tong: Tong) {
   }

   handler (payload: any): void {
      console.log("implement me");
   }
}

export class SetPlayerSpeedPacketHandler implements IPacketHandler {
   event = "set_player_speed";

   public constructor (private _tong: Tong) {
   }

   handler (payload: any): void {
      console.log("implement me");
   }
}
