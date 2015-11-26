export interface IPacket {
  event: string;
  payload: any;
}

export class NicknameInputPacket implements IPacket {
  event = "nickname_input";
  payload: any;

  constructor(nickname: string) {
    this.payload = { nickname : nickname };
  }
}

export class SetWheelRotationPacket implements IPacket {
  event = "set_wheel_rotation";
  payload: any;

  constructor(wheelRotation: number) {
    this.payload = { wheelRotation: wheelRotation };
  }
}

export class SetEngineForcePacket implements IPacket {
  event = "set_engine_force";
  payload: any;

  constructor(engineForce: number) {
    this.payload = { engineForce : engineForce };
  }
}

export class SetBrakingForcePacket implements IPacket {
  event = "set_braking_force";
  payload: any;

  constructor(brakingForce: number) {
    this.payload = { brakingForce : brakingForce };
  }
}
