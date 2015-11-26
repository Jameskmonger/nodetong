define(["require", "exports"], function (require, exports) {
    var HUDDrawing = (function () {
        function HUDDrawing() {
        }
        HUDDrawing.draw = function (fps, drawingDetails) {
            drawingDetails.context.clearRect(0, 0, drawingDetails.canvas.width, drawingDetails.canvas.height);
            drawingDetails.context.save();
            drawingDetails.context.font = "20px Arial";
            drawingDetails.context.fillStyle = "yellow";
            drawingDetails.context.fillText("FPS: " + fps.toFixed(0), 25, 45);
            drawingDetails.context.restore();
        };
        return HUDDrawing;
    })();
    exports.HUDDrawing = HUDDrawing;
});
