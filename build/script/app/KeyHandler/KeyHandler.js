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
        KeyHandler.prototype.isKeyPressed = function (code) {
            if (!(code in KeyHandler.KeyCodes)) {
                throw new Error("Attempted to use isKeyPressed on unregistered key");
            }
            return this.keyPressed[code];
        };
        KeyHandler.get = function (window) {
            if (window === void 0) { window = undefined; }
            if (KeyHandler.instance === undefined) {
                KeyHandler.instance = new KeyHandler(window);
            }
            return KeyHandler.instance;
        };
        KeyHandler.KeyCodes = {
            LEFT: 37,
            UP: 38,
            RIGHT: 39,
            DOWN: 40,
            SPACE: 32,
            Q_KEY: 81,
            E_KEY: 69
        };
        return KeyHandler;
    })();
    exports.KeyHandler = KeyHandler;
});
