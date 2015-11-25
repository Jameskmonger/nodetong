define(["require", "exports", './LoginScreenSubmissionEvent', '../Networking/Connection'], function (require, exports, LoginScreenSubmissionEvent_1, Connection_1) {
    var LoginScreen = (function () {
        function LoginScreen(scope) {
            this.scope = scope;
            var con = Connection_1.Connection.get();
            this.observers = [];
            this.getLoginForm().addEventListener("submit", function (event) {
                event.preventDefault();
                var nick = this.getEnteredNickname();
                if (nick.length > 0) {
                    this.notify(new LoginScreenSubmissionEvent_1.LoginScreenSubmissionEvent(nick));
                }
            }.bind(this));
        }
        LoginScreen.prototype.getEnteredNickname = function () {
            return this.getNicknameBox().value;
        };
        LoginScreen.prototype.getLoginForm = function () {
            return this.scope.querySelector('div.name-selection > form');
        };
        LoginScreen.prototype.getNicknameBox = function () {
            return this.getLoginForm().querySelector('input#nick');
        };
        LoginScreen.prototype.observe = function (observer) {
            this.observers.push(observer);
        };
        LoginScreen.prototype.notify = function (event) {
            this.observers.forEach(function (o) { o.observed(event); });
        };
        return LoginScreen;
    })();
    exports.LoginScreen = LoginScreen;
});
