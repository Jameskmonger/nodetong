import IScreen = require("./IScreen");
export class LoginScreen implements IScreen.IScreen {
  id = "name-selection";
  static instance: LoginScreen;

  constructor() {
    if (LoginScreen.instance !== undefined) {
      throw new Error("A connection instance has already been constructed. Use Connection.get()");
    }

    LoginScreen.instance = this;
  }

  public static get() {
    if (LoginScreen.instance === undefined) {
      LoginScreen.instance = new LoginScreen();
    }

    return LoginScreen.instance;
  }
}
