import { LoginScreenObserver } from "./Login/LoginScreenObserver";
import { IScreen } from "./Screen/IScreen";
import { LoginScreen } from "./Screen/LoginScreen";
import { GameScreen } from "./Screen/GameScreen";
import PacketHandlers = require("./Networking/Packet/PacketHandlers");
import { Connection } from "./Networking/Connection";

export class Tong {
  constructor(private doc) {

  }

  public localPlayerIndex: number;

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

Connection.get().addHandler(new PacketHandlers.LocalPlayerIndexPacketHandler(tong));
Connection.get().addHandler(new PacketHandlers.AddPlayerPacketHandler(tong));
Connection.get().addHandler(new PacketHandlers.RemovePlayerPacketHandler(tong));
Connection.get().addHandler(new PacketHandlers.SetPlayerVehicleSkinPacketHandler(tong));
Connection.get().addHandler(new PacketHandlers.SetPlayerVehicleModelPacketHandler(tong));
Connection.get().addHandler(new PacketHandlers.SetPlayerVehiclePositionPacketHandler(tong));
Connection.get().addHandler(new PacketHandlers.SetPlayerVehicleRotationPacketHandler(tong));
Connection.get().addHandler(new PacketHandlers.SetPlayerWheelPositionPacketHandler(tong));
Connection.get().addHandler(new PacketHandlers.SetPlayerSpeedPacketHandler(tong));


// We need to provide the document because we are getting the login screen for the first time
var login_screen: LoginScreen = LoginScreen.get(document);

login_screen.observe(new LoginScreenObserver());

tong.show(login_screen);
/*tong.hide(login_screen);

var game_screen: GameScreen = GameScreen.get(document);

tong.show(game_screen);*/
