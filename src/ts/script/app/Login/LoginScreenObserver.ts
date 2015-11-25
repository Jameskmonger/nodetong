import Packets = require("../Networking/Packet/Packets");
import Connection = require("../Networking/Connection");
import { LoginScreenSubmissionEvent } from './LoginScreenSubmissionEvent';
import { NodetongObserver } from '../Observer/NodetongObserver';

export class LoginScreenObserver implements NodetongObserver {
  observed (event: LoginScreenSubmissionEvent) {
    Connection.Connection.get().sendPacket(new Packets.NicknameInputPacket(event.getNickname()));
  }
}
