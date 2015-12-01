export class KeyHandler {
  static instance: KeyHandler;

  constructor(private window: Window) {
    if (KeyHandler.instance !== undefined) {
      throw new Error("An instance of singleton KeyHandler has already been constructed.");
    }

    if (this.window == undefined) {
      throw new Error("A valid window must be provided when creating a KeyHandler.");
    }
  }

  public static get(window: Window = undefined): KeyHandler {
    if (KeyHandler.instance === undefined) {
      KeyHandler.instance = new KeyHandler(window);
    }

    return KeyHandler.instance;
  }
}
