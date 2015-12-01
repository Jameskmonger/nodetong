export class KeyHandler {
  static instance: KeyHandler;

  static KeyCodes: any = {
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    SPACE: 32,
    Q_KEY: 81,
    E_KEY: 69
  };

  private keyPressed: Array<boolean>;

  constructor(private window: Window) {
    if (KeyHandler.instance !== undefined) {
      throw new Error("An instance of singleton KeyHandler has already been constructed.");
    }

    if (this.window == undefined) {
      throw new Error("A valid window must be provided when creating a KeyHandler.");
    }
  }

  public isKeyPressed(code: number): boolean {
    if (!(code in KeyHandler.KeyCodes)) {
      throw new Error("Attempted to use isKeyPressed on unregistered key");
    }

    return this.keyPressed[code];
  }

  public static get(window: Window = undefined): KeyHandler {
    if (KeyHandler.instance === undefined) {
      KeyHandler.instance = new KeyHandler(window);
    }

    return KeyHandler.instance;
  }
}
