export class Player {
   public positionX: number;
   public positionY: number;
   public modelId: number;
   public skinId: number;
   public static WHEEL_TURN_INCREMENT: number = 2.5;
   public static LEFT_TURN_MAX: number = 40;
   public static RIGHT_TURN_MAX: number = 140;
   public rotation = {
     vehicle: 90.0,
     wheel: 90.0
   };

   constructor(public id: number, public name: string) {

   }

   turnWheelRight(): void {
      this.setWheelRotation(this.getWheelRotation() + Player.WHEEL_TURN_INCREMENT);
   }

   turnWheelLeft() : void {
      this.setWheelRotation(this.getWheelRotation() - Player.WHEEL_TURN_INCREMENT);
   }

   getWheelRotation(): number {
      return this.rotation.wheel;
   }

   setWheelRotation(value): void {
      if (value > Player.LEFT_TURN_MAX && value < Player.RIGHT_TURN_MAX) {
         this.rotation.wheel = value;
      }
   }
}
