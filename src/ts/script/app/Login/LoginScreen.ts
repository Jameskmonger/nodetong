import { LoginScreenSubmissionEvent } from './LoginScreenSubmissionEvent';
import { NodetongEvent } from '../Event/NodetongEvent';
import { NodetongObserver } from '../Observer/NodetongObserver';
import { Connection } from '../Networking/Connection';

export class LoginScreen {
  private observers: Array<NodetongObserver>;

  constructor(private scope: HTMLDocument) {
    var con = new Connection();

    this.observers = [];

    this.getLoginForm().addEventListener("submit",
      function (event) {
        event.preventDefault();

        var nick: string = this.getEnteredNickname();

        if (nick.length > 0) {
          this.notify(new LoginScreenSubmissionEvent(nick));
        }
      }.bind(this)
    );
  }

  private getEnteredNickname() {
    return this.getNicknameBox().value;
  }

  private getLoginForm() {
    return this.scope.querySelector('div.name-selection > form');
  }

  private getNicknameBox() {
    return <HTMLInputElement>this.getLoginForm().querySelector('input#nick');
  }

  public observe(observer: NodetongObserver) {
    this.observers.push(observer);
  }

  private notify(event: NodetongEvent) {
    this.observers.forEach(o => { o.observed(event); });
  }
}
