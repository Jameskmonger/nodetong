define(["require", "exports"], function (require, exports) {
    var PlayerDrawing = (function () {
        function PlayerDrawing() {
        }
        PlayerDrawing.draw = function (tong, drawingDetails) {
            tong.getPlayers().forEach(function (player) {
                console.log("i am trying to draw a player called " + player.name);
            });
        };
        return PlayerDrawing;
    })();
    exports.PlayerDrawing = PlayerDrawing;
});
