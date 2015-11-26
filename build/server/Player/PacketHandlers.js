var NicknameInputHandler = (function () {
    function NicknameInputHandler() {
        this.event = "nickname_input";
    }
    NicknameInputHandler.prototype.handler = function (receiver, payload) {
        console.log("NicknameInputHandler received '" + payload + "'");
    };
    return NicknameInputHandler;
})();
exports.NicknameInputHandler = NicknameInputHandler;
