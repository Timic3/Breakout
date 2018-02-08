import { Drawable } from './Drawable';

export class Firewall extends Drawable {
  constructor(context: CanvasRenderingContext2D) {
    super(0, 0, context);
  }

  draw() {
    this.context.beginPath();
    this.context.strokeStyle = 'white';
    this.context.lineWidth = 2;
    for (let x = 0; x < 9; x++) {
      for (let y = 0; y < 3; y++) {
        this.context.rect(5 + 55 * x, 5 + 25 * y, 50, 20);
      }
    }
    this.context.stroke();
    this.context.closePath();
  }
}
