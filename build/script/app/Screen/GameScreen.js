define(["require", "exports", "./GameScreen/WorldDrawing", "../request_animation_frame"], function (require, exports, WorldDrawing_1) {
    var GameScreen = (function () {
        function GameScreen(scope) {
            this.scope = scope;
            this.id = "game-screen";
            if (GameScreen.instance !== undefined) {
                throw new Error("A GameScreen instance has already been constructed. Use GameScreen.get()");
            }
            var world_canvas = scope.getElementById('world_canvas');
            var player_canvas = scope.getElementById('players_canvas');
            this.drawing = {
                world: {
                    canvas: world_canvas,
                    context: world_canvas.getContext('2d')
                },
                players: {
                    canvas: player_canvas,
                    context: player_canvas.getContext('2d')
                }
            };
        }
        GameScreen.prototype.onShow = function () {
            console.log("showing game");
            window.onresize += this.resized.bind(this);
            this.resized();
            window.requestAnimationFrame(this.draw.bind(this));
        };
        GameScreen.prototype.onHide = function () {
        };
        GameScreen.prototype.draw = function () {
            WorldDrawing_1.WorldDrawing.draw(this.drawing.world.canvas);
            window.requestAnimationFrame(this.draw.bind(this));
        };
        GameScreen.prototype.resized = function () {
            this.drawing.world.canvas.width = window.innerWidth;
            this.drawing.world.canvas.height = window.innerHeight;
            this.drawing.players.canvas.width = window.innerWidth;
            this.drawing.players.canvas.height = window.innerHeight;
        };
        GameScreen.get = function (scope) {
            if (scope === void 0) { scope = undefined; }
            if (GameScreen.instance === undefined) {
                if (scope === undefined) {
                    throw new Error("A scope must be provided to get a GameScreen instance if one is not already made.");
                }
                GameScreen.instance = new GameScreen(scope);
            }
            return GameScreen.instance;
        };
        return GameScreen;
    })();
    exports.GameScreen = GameScreen;
});
