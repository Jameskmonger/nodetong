var GameState_1 = require("./GameState");
var NicknameInputHandler = (function () {
    function NicknameInputHandler() {
        this.event = "nickname_input";
    }
    NicknameInputHandler.prototype.handler = function (receiver, payload) {
        var nick = payload.nickname;
        var regex = /^[a-z,A-Z,0-9]([a-z,A-Z,0-9, ]*[a-z,A-Z,0-9])?$/;
        if (regex.test(nick) && receiver.getState() === GameState_1.GameState.CONNECTED) {
            receiver.setName(nick);
        }
    };
    return NicknameInputHandler;
})();
exports.NicknameInputHandler = NicknameInputHandler;
