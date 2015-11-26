define(["require", "exports", "./Login/LoginScreenObserver", "./Screen/LoginScreen"], function (require, exports, LoginScreenObserver_1, LoginScreen_1) {
    var Tong = (function () {
        function Tong(doc) {
            this.doc = doc;
        }
        Tong.prototype.show = function (screen) {
            this.doc.getElementById(screen.id).style.display = "block";
        };
        Tong.prototype.hide = function (screen) {
            this.doc.getElementById(screen.id).style.display = "none";
        };
        return Tong;
    })();
    var tong = new Tong(document);
    var screen = LoginScreen_1.LoginScreen.get(document);
    screen.observe(new LoginScreenObserver_1.LoginScreenObserver());
    tong.show(screen);
});
