define(function (require) {
  "use strict";

  function LoginScreen(scope) {
    this._observers = [];

    _getLoginForm().addEventListener("submit",
      function (event) {
        (_formSubmitEvent.bind(this))(event);
      }.bind(this)
    );

    function _getLoginForm() {
      return scope.querySelector('div.name-selection > form');
    }

    function _getNicknameBox() {
      return _getLoginForm().querySelector('input#nick');
    }

    function _formSubmitEvent(event) {
      event.preventDefault();

      var LOGIN_SUBMISSION_CODE = 3;

      var data = {
        type: LOGIN_SUBMISSION_CODE,
        payload: [_getNicknameBox().value]
      };

      this.notify(data);
    }
  }

  LoginScreen.prototype = {
    constructor: LoginScreen,

    observe: function(observer) {
      this._observers.push(observer);
    },

    notify: function(event) {
      for(var i = 0; i < this._observers.length; i++) {
        this._observers[i].observed(event);
      }
    }
  };

  return LoginScreen;
});
