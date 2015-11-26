define(["require", "exports", '../Login/LoginScreenSubmissionEvent'], function (require, exports, LoginScreenSubmissionEvent_1) {
    var LoginScreen = (function () {
        function LoginScreen(scope) {
            this.scope = scope;
            this.id = "name-selection";
            if (LoginScreen.instance !== undefined) {
                throw new Error("A connection instance has already been constructed. Use Connection.get()");
            }
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
            return this.scope.querySelector('div#name-selection form');
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
        LoginScreen.get = function (scope) {
            if (scope === void 0) { scope = undefined; }
            if (LoginScreen.instance === undefined) {
                if (scope === undefined) {
                    throw new Error("A scope must be provided to get a LoginScreen instance if one is not already made.");
                }
                LoginScreen.instance = new LoginScreen(scope);
            }
            return LoginScreen.instance;
        };
        return LoginScreen;
    })();
    exports.LoginScreen = LoginScreen;
});
