define(["require", "exports", 'socket.io'], function (require, exports, socketIO) {
    var Connection = (function () {
        function Connection() {
            this.socket = socketIO();
            this.socket.emit("ping", "new networking with proper socket!!");
        }
        return Connection;
    })();
    exports.Connection = Connection;
});
