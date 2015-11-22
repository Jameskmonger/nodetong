var GameServer = (function () {
    function GameServer(io) {
        this.io = io;
        this.setupSocketEventListeners();
    }
    GameServer.prototype.setupSocketEventListeners = function () {
        this.io.sockets.on('connection', function (socket) {
            console.log("we got a connection!!");
        });
    };
    return GameServer;
})();
exports.GameServer = GameServer;
