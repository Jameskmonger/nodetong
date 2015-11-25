define(["require", "exports", 'socket.io', './Packet/Packets'], function (require, exports, socketIO, Packets) {
    var Connection = (function () {
        function Connection() {
            if (Connection.instance !== undefined) {
                throw new Error("A connection instance has already been constructed. Use Connection.get()");
            }
            this.socket = socketIO();
            this.sendPacket(new Packets.PingPacket("new networking with packets!"));
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
