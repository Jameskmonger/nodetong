import IScreen = require("./IScreen");
import { LoginScreenSubmissionEvent } from '../Login/LoginScreenSubmissionEvent';
import { NodetongEvent } from '../Event/NodetongEvent';
import { NodetongObserver } from '../Observer/NodetongObserver';
import { Connection } from '../Networking/Connection';

export class LoginScreen implements IScreen.IScreen {
  id = "name-selection";
  static instance: LoginScreen;

  private observers: Array<NodetongObserver>;

  constructor(private scope: HTMLDocument) {
    if (LoginScreen.instance !== undefined) {
      throw new Error("A connection instance has already been constructed. Use Connection.get()");
    }

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
    return this.scope.querySelector('div#name-selection form');
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

  public static get(scope: HTMLDocument = undefined) {
    if (LoginScreen.instance === undefined) {
      if (scope === undefined) {
        throw new Error("A scope must be provided to get a LoginScreen instance if one is not already made.");
      }

      LoginScreen.instance = new LoginScreen(scope);
    }

    return LoginScreen.instance;
  }
}
