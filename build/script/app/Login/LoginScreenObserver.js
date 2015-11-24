define(["require", "exports"], function (require, exports) {
    var LoginScreenObserver = (function () {
        function LoginScreenObserver() {
        }
        LoginScreenObserver.prototype.observed = function (event) {
            console.log(event.getNickname());
        };
        return LoginScreenObserver;
    })();
    exports.LoginScreenObserver = LoginScreenObserver;
});
