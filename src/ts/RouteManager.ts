export class RouteManager {
  server: any;
  app: any;

  constructor(private express: any) {
    this.app = new express();
    this.setupRoutes();
    this.listen(3000);
  }

  setupRoutes() {
    this.app.use("/assets", this.express.static(__dirname + "/assets"));

    this.app.use("/script", this.express.static(__dirname + "/script"));

    this.app.get('/', function(req, res) {
      res.sendFile(__dirname + '/index.html');
    });
  }

  listen(port: number) {
    this.server = this.app.listen(port, function () {
      var host : string = this.address().address;
      var port : number = this.address().port;

      console.log('Nodetong listening on http://%s:%s', host, port);
    });
  }

  getServer() {
    return this.server;
  }
}
