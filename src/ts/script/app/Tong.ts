import { LoginScreenObserver } from "./Login/LoginScreenObserver";
import { IScreen } from "./Screen/IScreen";
import { LoginScreen } from "./Screen/LoginScreen";

class Tong {
  constructor(private doc) {

  }

  show(screen: IScreen) {
    this.doc.getElementById(screen.id).style.display = "block";
  }

  hide(screen: IScreen) {
    this.doc.getElementById(screen.id).style.display = "none";
  }
}

var tong = new Tong(document);

// We need to provide the document because we are getting the login screen for the first time
var screen: LoginScreen = LoginScreen.get(document);

screen.observe(new LoginScreenObserver());

tong.show(screen);
