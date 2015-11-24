define(["require", "exports", 'socket.io', './Packet/Packets'], function (require, exports, socketIO, Packets) {
    var Connection = (function () {
        function Connection() {
            this.socket = socketIO();
            this.sendPacket(new Packets.PingPacket("new networking with packets!"));
        }
        Connection.prototype.sendPacket = function (packet) {
            this.socket.emit(packet.event, packet.payload);
        };
        return Connection;
    })();
    exports.Connection = Connection;
});
