define(["require", "exports"], function (require, exports) {
    var KeyHandler = (function () {
        function KeyHandler(window) {
            this.window = window;
            if (KeyHandler.instance !== undefined) {
                throw new Error("An instance of singleton KeyHandler has already been constructed.");
            }
            if (this.window == undefined) {
                throw new Error("A valid window must be provided when creating a KeyHandler.");
            }
        }
        KeyHandler.get = function (window) {
            if (window === void 0) { window = undefined; }
            if (KeyHandler.instance === undefined) {
                KeyHandler.instance = new KeyHandler(window);
            }
            return KeyHandler.instance;
        };
        return KeyHandler;
    })();
    exports.KeyHandler = KeyHandler;
});
