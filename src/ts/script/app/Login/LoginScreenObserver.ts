import { LoginScreenSubmissionEvent } from './LoginScreenSubmissionEvent';
import { NodetongObserver } from '../Observer/NodetongObserver';

export class LoginScreenObserver implements NodetongObserver {
  observed (event: LoginScreenSubmissionEvent) {
    console.log(event.getNickname());
  }
}
