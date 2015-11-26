import { LoginScreenObserver } from "./Login/LoginScreenObserver";
import { IScreen } from "./Screen/IScreen";
import { LoginScreen } from "./Screen/LoginScreen";

class Tong {
  constructor(private doc) {

  }

  show(screen: IScreen) {
    this.doc.getElementById(screen.id).style.display = "block";
    screen.onShow();
  }

  hide(screen: IScreen) {
    this.doc.getElementById(screen.id).style.display = "none";
    screen.onHide();
  }
}

var tong = new Tong(document);

// We need to provide the document because we are getting the login screen for the first time
var login_screen: LoginScreen = LoginScreen.get(document);

login_screen.observe(new LoginScreenObserver());

tong.show(login_screen);
