define(["require", "exports"], function (require, exports) {
    var LoginScreen = (function () {
        function LoginScreen() {
            this.id = "name-selection";
            if (LoginScreen.instance !== undefined) {
                throw new Error("A connection instance has already been constructed. Use Connection.get()");
            }
            LoginScreen.instance = this;
        }
        LoginScreen.get = function () {
            if (LoginScreen.instance === undefined) {
                LoginScreen.instance = new LoginScreen();
            }
            return LoginScreen.instance;
        };
        return LoginScreen;
    })();
    exports.LoginScreen = LoginScreen;
});
