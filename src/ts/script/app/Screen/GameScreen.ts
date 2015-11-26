import { IScreen } from "./IScreen";

export class GameScreen implements IScreen {
  id = "name-selection";
  static instance: GameScreen;

  constructor(private scope: HTMLDocument) {
    if (GameScreen.instance !== undefined) {
      throw new Error("A GameScreen instance has already been constructed. Use GameScreen.get()");
    }
  }

  public static get(scope: HTMLDocument = undefined) {
    if (GameScreen.instance === undefined) {
      if (scope === undefined) {
        throw new Error("A scope must be provided to get a GameScreen instance if one is not already made.");
      }

      GameScreen.instance = new GameScreen(scope);
    }

    return GameScreen.instance;
  }
}
