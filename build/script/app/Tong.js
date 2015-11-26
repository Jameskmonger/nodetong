define(["require", "exports", "./Login/LoginScreenObserver", "./Screen/LoginScreen", "./Screen/GameScreen"], function (require, exports, LoginScreenObserver_1, LoginScreen_1, GameScreen_1) {
    var Tong = (function () {
        function Tong(doc) {
            this.doc = doc;
        }
        Tong.prototype.show = function (screen) {
            this.doc.getElementById(screen.id).style.display = "block";
            screen.onShow();
        };
        Tong.prototype.hide = function (screen) {
            this.doc.getElementById(screen.id).style.display = "none";
            screen.onHide();
        };
        return Tong;
    })();
    var tong = new Tong(document);
    var login_screen = LoginScreen_1.LoginScreen.get(document);
    login_screen.observe(new LoginScreenObserver_1.LoginScreenObserver());
    tong.show(login_screen);
    tong.hide(login_screen);
    var game_screen = GameScreen_1.GameScreen.get(document);
    tong.show(game_screen);
});
