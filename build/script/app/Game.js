define(['./Observer/LoginScreenObserver', './Login/LoginScreen', './KeyHandler', './Vehicle', './Player', './World'],
        function (_loginScreenObserver, _loginScreen, KeyHandler, Vehicle, Player, World) {

  var LoginScreen = _loginScreen.LoginScreen;
  var LoginScreenObserver = _loginScreenObserver.LoginScreenObserver;

  function Game() {
    var KEY_DETECTION_INTERVAL = 25;
    var GAME_LOOP_INTERVAL = 50;

    this._player_array = [];
    this.LOCAL_PLAYER_ID = undefined;
    this.movement_network_listener = undefined;
    this._key_handler = new KeyHandler(document);
    this._world = new World();

    setInterval(this._keyDetectionLoop.bind(this), KEY_DETECTION_INTERVAL);
    setInterval(this._gameLoop.bind(this), GAME_LOOP_INTERVAL);

    this._login_screen = new LoginScreen(document);

    this._login_screen.observe(new LoginScreenObserver());
  }

  Game.prototype = {
    constructor: Game,

    callMovementListener: function () {
      if (this.movement_network_listener !== undefined) {
        this.movement_network_listener();
      }
    },

    setMovementListener: function (listener) {
      this.movement_network_listener = listener;
    },

    getWorld: function () {
      return this._world;
    },

    getPlayerArray: function () {
      return this._player_array;
    },

    getLocalPlayer: function () {
      return this._player_array[this.LOCAL_PLAYER_ID];
    },

    setLocalPlayerId: function (id) {
      this.LOCAL_PLAYER_ID = id;
    },

    removePlayer: function (id) {
      this._player_array[id] = undefined;
    },

    setCarData: function (id, data) {
      if (data === undefined) {
        return;
      }

      data._vehicle.is_server_instance = false;
      data._vehicle._server_methods = undefined;

      var requires_full_update;

      if (id === this.LOCAL_PLAYER_ID) {
        if (this._player_array[id] !== undefined) {
          var vehicle = new Vehicle(data._vehicle);
          var player_vehicle = this._player_array[id].getVehicle();

          var close_to_x = (vehicle.position.x.closeTo(player_vehicle.position.x, 0.1));
          var close_to_y = (vehicle.position.y.closeTo(player_vehicle.position.y, 0.1));

          if (!close_to_x || !close_to_y) {
            this._player_array[id].getVehicle().setPosition(vehicle.position.x, vehicle.position.y);
          }

          var matches_rotation = (vehicle.rotation.vehicle == player_vehicle.rotation.vehicle);

          if (!matches_rotation) {
            this._player_array[id].getVehicle().setVehicleRotation(vehicle.rotation.vehicle);
          }
        } else {
          requires_full_update = true;
        }
      } else {
        requires_full_update = true;
      }

      if (requires_full_update) {
        var player = new Player(data);

        player._vehicle = new Vehicle(player._vehicle);

        player._vehicle.setGame(this);

        this._player_array[id] = player;
      }
    },

    _keyDetectionLoop: function () {
      if (this.getLocalPlayer() === undefined) {
        return;
      }

      var local_car = this.getLocalPlayer().getVehicle();

      if (local_car === undefined) {
        return;
      }

      if (this._key_handler.pressing(KeyHandler.KeyCodes.UP)) {
        local_car.setEnginePower(100.0);

        this.callMovementListener();
      }

      if (!this._key_handler.pressing(KeyHandler.KeyCodes.UP)) {
        local_car.setEnginePower(0.0);

        this.callMovementListener();
      }

      if (this._key_handler.pressing(KeyHandler.KeyCodes.DOWN)) {
        local_car.setBrakingForce(150.0);

        this.callMovementListener();
      }

      if (!this._key_handler.pressing(KeyHandler.KeyCodes.DOWN)) {
        local_car.setBrakingForce(0.0);

        this.callMovementListener();
      }

      if (this._key_handler.pressing(KeyHandler.KeyCodes.LEFT)) {
        local_car.turnWheelLeft();

        this.callMovementListener();
      }

      if (this._key_handler.pressing(KeyHandler.KeyCodes.RIGHT)) {
        local_car.turnWheelRight();

        this.callMovementListener();
      }

      if (this._key_handler.pressing(KeyHandler.KeyCodes.LEFT) !== true && this._key_handler.pressing(KeyHandler.KeyCodes.RIGHT) !== true) {
        local_car.straightenWheel();

        this.callMovementListener();
      }
    },

    _gameLoop: function () {
      _.forEach(this.getPlayerArray(), function(player) {
        if (player !== undefined) {
          player.getVehicle().processMovement();
        }
      });
    }
  };

  return Game;
});
