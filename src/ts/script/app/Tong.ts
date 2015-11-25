import IScreen = require("./Screen/IScreen");
import LoginScreen = require("./Screen/LoginScreen");

class Tong {
  constructor(private doc) {

  }

  show(screen: IScreen.IScreen) {
    this.doc.getElementById(screen.id).style.display = "block";
  }
}

var tong = new Tong(document);

tong.show(LoginScreen.LoginScreen.get());
