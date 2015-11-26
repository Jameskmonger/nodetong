var GameState_1 = require("./GameState");
var NicknameInputHandler = (function () {
    function NicknameInputHandler() {
        this.event = "nickname_input";
    }
    NicknameInputHandler.prototype.handler = function (receiver, payload) {
        var regex = /^[a-z,A-Z,0-9, ]*$/g;
        if (regex.test(payload) && receiver.getState() === GameState_1.GameState.CONNECTED) {
            receiver.setName(payload);
        }
    };
    return NicknameInputHandler;
})();
exports.NicknameInputHandler = NicknameInputHandler;
