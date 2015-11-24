import { NodetongEventType } from '../Event/NodetongEventType';
import { NodetongEvent } from '../Event/NodetongEvent';

export class LoginScreenSubmissionEvent implements NodetongEvent {
  code: NodetongEventType = NodetongEventType.LOGIN_SCREEN_SUBMISSION;
  payload: Array<any>;

  constructor(nickname: string) {
    this.payload = [nickname];
  }

  getNickname() {
    return this.payload[0];
  }
}
