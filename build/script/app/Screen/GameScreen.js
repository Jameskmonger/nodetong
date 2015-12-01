define(["require", "exports", "./GameScreen/WorldDrawing", "./GameScreen/PlayerDrawing", "./GameScreen/HUDDrawing", "../request_animation_frame"], function (require, exports, WorldDrawing_1, PlayerDrawing_1, HUDDrawing_1) {
    var GameScreen = (function () {
        function GameScreen(tong, scope) {
            this.tong = tong;
            this.scope = scope;
            this.id = "game-screen";
            if (GameScreen.instance !== undefined) {
                throw new Error("A GameScreen instance has already been constructed. Use GameScreen.get()");
            }
            var world_canvas = scope.getElementById('world_canvas');
            var player_canvas = scope.getElementById('players_canvas');
            var hud_canvas = scope.getElementById('hud_canvas');
            this.drawing = {
                world: {
                    canvas: world_canvas,
                    context: world_canvas.getContext('2d')
                },
                players: {
                    canvas: player_canvas,
                    context: player_canvas.getContext('2d')
                },
                HUD: {
                    canvas: hud_canvas,
                    context: hud_canvas.getContext('2d')
                }
            };
        }
        GameScreen.prototype.onShow = function () {
            window.onresize += this.resized.bind(this);
            this.resized();
            window.requestAnimationFrame(this.draw.bind(this));
        };
        GameScreen.prototype.onHide = function () {
        };
        GameScreen.prototype.draw = function () {
            if (this.lastDrawnTime === 0) {
                this.lastDrawnTime = Date.now();
                this.fps = 0;
                window.requestAnimationFrame(this.draw.bind(this));
                return;
            }
            var delta = (new Date().getTime() - this.lastDrawnTime) / 1000;
            this.lastDrawnTime = Date.now();
            this.fps = 1 / delta;
            WorldDrawing_1.WorldDrawing.draw(this.drawing.world.canvas);
            PlayerDrawing_1.PlayerDrawing.draw(this.tong, this.drawing.players);
            HUDDrawing_1.HUDDrawing.draw(this.fps, this.drawing.HUD);
            window.requestAnimationFrame(this.draw.bind(this));
        };
        GameScreen.prototype.resized = function () {
            this.drawing.world.canvas.width = window.innerWidth;
            this.drawing.world.canvas.height = window.innerHeight;
            this.drawing.players.canvas.width = window.innerWidth;
            this.drawing.players.canvas.height = window.innerHeight;
            this.drawing.HUD.canvas.width = window.innerWidth;
            this.drawing.HUD.canvas.height = window.innerHeight;
        };
        GameScreen.get = function (tong, scope) {
            if (tong === void 0) { tong = undefined; }
            if (scope === void 0) { scope = undefined; }
            if (GameScreen.instance === undefined) {
                if (tong === undefined) {
                    throw new Error("A Tong must be provided to get a GameScreen instance if one is not already made.");
                }
                if (scope === undefined) {
                    throw new Error("A scope must be provided to get a GameScreen instance if one is not already made.");
                }
                GameScreen.instance = new GameScreen(tong, scope);
            }
            return GameScreen.instance;
        };
        return GameScreen;
    })();
    exports.GameScreen = GameScreen;
});
