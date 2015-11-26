import Packets = require("../Networking/Packet/Packets");
import { Connection } from "../Networking/Connection";
import { LoginScreenSubmissionEvent } from './LoginScreenSubmissionEvent';
import { NodetongObserver } from '../Observer/NodetongObserver';

export class LoginScreenObserver implements NodetongObserver {
  observed (event: LoginScreenSubmissionEvent) {
    Connection.get().sendPacket(new Packets.NicknameInputPacket(event.getNickname()));
  }
}
