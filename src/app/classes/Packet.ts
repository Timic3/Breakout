import { Drawable } from './Drawable';

export class Packet extends Drawable {
  constructor(x: number, y: number, context: CanvasRenderingContext2D) {
    super(x, y, context);
  }

  draw() {
    this.context.beginPath();
    this.context.fillStyle = 'white';
    this.context.arc(this.x, this.y, 10, 0, Math.PI * 2);
    this.context.fill();
    this.context.closePath();
  }
}
