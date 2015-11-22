var RouteManager = (function () {
    function RouteManager(express) {
        this.express = express;
        this.app = new express();
        this.setupRoutes();
        this.listen(3000);
    }
    RouteManager.prototype.setupRoutes = function () {
        this.app.use("/assets", this.express.static(__dirname + "/assets"));
        this.app.use("/script", this.express.static(__dirname + "/script"));
        this.app.get('/', function (req, res) {
            res.sendFile(__dirname + '/index.html');
        });
    };
    RouteManager.prototype.listen = function (port) {
        this.server = this.app.listen(port, function () {
            var host = this.address().address;
            var port = this.address().port;
            console.log('Nodetong listening on http://%s:%s', host, port);
        });
    };
    RouteManager.prototype.getServer = function () {
        return this.server;
    };
    return RouteManager;
})();
exports.RouteManager = RouteManager;
