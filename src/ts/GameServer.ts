export class GameServer {
  constructor(private io: any) {
    this.setupSocketEventListeners();
  }

  setupSocketEventListeners() {
    this.io.sockets.on('connection', function(socket) {
      console.log("we got a connection!!");
    });
  }
}
