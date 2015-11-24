define(["require", "exports", '../Event/NodetongEventType'], function (require, exports, NodetongEventType_1) {
    var LoginScreenSubmissionEvent = (function () {
        function LoginScreenSubmissionEvent(nickname) {
            this.code = NodetongEventType_1.NodetongEventType.LOGIN_SCREEN_SUBMISSION;
            this.payload = [nickname];
        }
        LoginScreenSubmissionEvent.prototype.getNickname = function () {
            return this.payload[0];
        };
        return LoginScreenSubmissionEvent;
    })();
    exports.LoginScreenSubmissionEvent = LoginScreenSubmissionEvent;
});
