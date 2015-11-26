import { Player } from "../Player/Player.ts";

export interface IPacket {
  event: string;
  payload: any;
}

export class LocalPlayerIndexPacket implements IPacket {
  event = "local_player_index";
  payload: any;

  constructor(localPlayerIndex: number) {
    this.payload = { localPlayerIndex: localPlayerIndex };
  }
}

export class AddPlayerPacket implements IPacket {
  event = "add_player";
  payload: any;

  constructor(player: Player) {
    this.payload = {
      player: {
         id: player.id,
         name: player.getName()
      }
    };
  }
}

export class RemovePlayerPacket implements IPacket {
  event = "remove_player";
  payload: any;

  constructor(player: Player) {
    this.payload = {
      player: {
         id: player.id
      }
    };
  }
}

export class SetPlayerVehicleSkinPacket implements IPacket {
  event = "set_player_vehicle_skin";
  payload: any;

  constructor(player: Player) {
    this.payload = {
      player: {
         id: player.id,
         skinId: player.skinId
      }
    };
  }
}

export class SetPlayerVehicleModelPacket implements IPacket {
  event = "set_player_vehicle_model";
  payload: any;

  constructor(player: Player) {
    this.payload = {
      player: {
         id: player.id,
         modelId: player.modelId
      },
    };
  }
}

export class SetPlayerVehiclePositionPacket implements IPacket {
  event = "set_player_vehicle_position";
  payload: any;

  constructor(player: Player, xCoordinate: number, yCoordinate: number) {
    this.payload = {
      player: {
         id: player.id
      },
      position: {
         x: xCoordinate,
         y: yCoordinate
      }
    };
  }
}

export class SetPlayerVehicleRotationPacket implements IPacket {
  event = "set_player_vehicle_position";
  payload: any;

  constructor(player: Player, vehicleRotation: number) {
    this.payload = {
      player: {
         id: player.id
      },
      vehicleRotation: vehicleRotation
    };
  }
}

export class SetPlayerWheelRotationPacket implements IPacket {
  event = "set_player_wheel_position";
  payload: any;

  constructor(player: Player, wheelRotation: number) {
    this.payload = {
      player: {
         id: player.id
      },
      wheelRotation: wheelRotation
    };
  }
}

export class SetPlayerSpeedPacket implements IPacket {
  event = "set_player_speed";
  payload: any;

  constructor(player: Player, speed: number) {
    this.payload = {
      player: {
         id: player.id
      },
      speed: speed
    };
  }
}
