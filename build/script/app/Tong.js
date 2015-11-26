define(["require", "exports", "./Screen/LoginScreen"], function (require, exports, LoginScreen) {
    var Tong = (function () {
        function Tong(doc) {
            this.doc = doc;
        }
        Tong.prototype.show = function (screen) {
            this.doc.getElementById(screen.id).style.display = "block";
        };
        return Tong;
    })();
    var tong = new Tong(document);
    tong.show(LoginScreen.LoginScreen.get());
});
