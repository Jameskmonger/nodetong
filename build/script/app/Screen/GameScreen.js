define(["require", "exports"], function (require, exports) {
    var GameScreen = (function () {
        function GameScreen(scope) {
            this.scope = scope;
            this.id = "game-screen";
            if (GameScreen.instance !== undefined) {
                throw new Error("A GameScreen instance has already been constructed. Use GameScreen.get()");
            }
        }
        GameScreen.prototype.onShow = function () {
        };
        GameScreen.get = function (scope) {
            if (scope === void 0) { scope = undefined; }
            if (GameScreen.instance === undefined) {
                if (scope === undefined) {
                    throw new Error("A scope must be provided to get a GameScreen instance if one is not already made.");
                }
                GameScreen.instance = new GameScreen(scope);
            }
            return GameScreen.instance;
        };
        return GameScreen;
    })();
    exports.GameScreen = GameScreen;
});
