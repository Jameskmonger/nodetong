import { LoginScreenSubmissionEvent } from './LoginScreenSubmissionEvent';
import { NodetongEvent } from '../Event/NodetongEvent';
import { NodetongObserver } from '../Observer/NodetongObserver';

export class LoginScreen {
  private observers: Array<NodetongObserver>;

  constructor(private scope: HTMLDocument) {
    this.observers = [];

    this.getLoginForm().addEventListener("submit",
      function (event) {
        event.preventDefault();

        this.notify(new LoginScreenSubmissionEvent(this.getNicknameBox().value));
      }.bind(this)
    );
  }

  private getLoginForm() {
    return this.scope.querySelector('div.name-selection > form');
  }

  private getNicknameBox() {
    return this.getLoginForm().querySelector('input#nick');
  }

  public observe(observer: any) {
    this.observers.push(observer);
  }

  private notify(event: NodetongEvent) {
    this.observers.forEach(o => { o.observed(event); });
  }
}
