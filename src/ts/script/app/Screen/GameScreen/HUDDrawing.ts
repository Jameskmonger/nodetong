export class HUDDrawing {
  static draw(fps: number, drawingDetails: any) {
    drawingDetails.context.clearRect(0, 0, drawingDetails.canvas.width, drawingDetails.canvas.height);

    drawingDetails.context.save();
    drawingDetails.context.font = "20px Arial";
    drawingDetails.context.fillStyle = "yellow";
    drawingDetails.context.fillText("FPS: " + fps.toFixed(0), 25, 45);
    drawingDetails.context.restore();
  }
}
