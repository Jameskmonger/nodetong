///<amd-dependency path="../request_animation_frame" />

import { IScreen } from "./IScreen";
import { WorldDrawing } from "./GameScreen/WorldDrawing";
import { PlayerDrawing } from "./GameScreen/PlayerDrawing";
import { HUDDrawing } from "./GameScreen/HUDDrawing";
import { Tong } from "../Tong";

export class GameScreen implements IScreen {
  id = "game-screen";
  static instance: GameScreen;
  drawing: any;
  lastDrawnTime: number;
  fps: number;

  constructor(private tong: Tong, private scope: HTMLDocument) {
    if (GameScreen.instance !== undefined) {
      throw new Error("A GameScreen instance has already been constructed. Use GameScreen.get()");
    }

    var world_canvas: HTMLCanvasElement = <HTMLCanvasElement> scope.getElementById('world_canvas');
    var player_canvas: HTMLCanvasElement = <HTMLCanvasElement> scope.getElementById('players_canvas');
    var hud_canvas: HTMLCanvasElement = <HTMLCanvasElement> scope.getElementById('hud_canvas');

    this.drawing = {
      world: {
        canvas: world_canvas,
        context: world_canvas.getContext('2d')
      },
      players: {
        canvas: player_canvas,
        context: player_canvas.getContext('2d')
      },
      HUD: {
        canvas: hud_canvas,
        context: hud_canvas.getContext('2d')
      }
    };
  }

  onShow() {
    window.onresize += this.resized.bind(this);
    this.resized();

    window.requestAnimationFrame(this.draw.bind(this));
  }

  onHide() {

  }

  draw() {
    if(this.lastDrawnTime === 0) {
      this.lastDrawnTime = Date.now();
      this.fps = 0;

      window.requestAnimationFrame(this.draw.bind(this));
      return;
    }

    var delta = (new Date().getTime() - this.lastDrawnTime)/1000;
    this.lastDrawnTime = Date.now();
    this.fps = 1 / delta;

    WorldDrawing.draw(this.tong, this.drawing.world.canvas);
    PlayerDrawing.draw(this.tong, this.drawing.players);
    HUDDrawing.draw(this.fps, this.drawing.HUD);

    window.requestAnimationFrame(this.draw.bind(this));
  }

  resized() {
    this.drawing.world.canvas.width = window.innerWidth;
    this.drawing.world.canvas.height = window.innerHeight;
    this.drawing.players.canvas.width = window.innerWidth;
    this.drawing.players.canvas.height = window.innerHeight;
    this.drawing.HUD.canvas.width = window.innerWidth;
    this.drawing.HUD.canvas.height = window.innerHeight;
  }

  public static get(tong: Tong = undefined, scope: HTMLDocument = undefined) {
    if (GameScreen.instance === undefined) {
      if (tong === undefined) {
        throw new Error("A Tong must be provided to get a GameScreen instance if one is not already made.");
      }

      if (scope === undefined) {
        throw new Error("A scope must be provided to get a GameScreen instance if one is not already made.");
      }

      GameScreen.instance = new GameScreen(tong, scope);
    }

    return GameScreen.instance;
  }
}
