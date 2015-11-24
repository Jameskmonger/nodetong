define(["require", "exports", './LoginScreenSubmissionEvent'], function (require, exports, LoginScreenSubmissionEvent_1) {
    var LoginScreen = (function () {
        function LoginScreen(scope) {
            this.scope = scope;
            this.observers = [];
            this.getLoginForm().addEventListener("submit", function (event) {
                event.preventDefault();
                this.notify(new LoginScreenSubmissionEvent_1.LoginScreenSubmissionEvent(this.getNicknameBox().value));
            }.bind(this));
        }
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
