define(["require", "exports", 'socket.io'], function (require, exports, socketIO) {
    var Connection = (function () {
        function Connection() {
            if (Connection.instance !== undefined) {
                throw new Error("A connection instance has already been constructed. Use Connection.get()");
            }
            this.socket = socketIO();
            Connection.instance = this;
        }
        Connection.prototype.sendPacket = function (packet) {
            this.socket.emit(packet.event, packet.payload);
        };
        Connection.get = function () {
            if (Connection.instance === undefined) {
                Connection.instance = new Connection();
            }
            return Connection.instance;
        };
        return Connection;
    })();
    exports.Connection = Connection;
});
