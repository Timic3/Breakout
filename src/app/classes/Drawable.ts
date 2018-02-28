export abstract class Drawable {
  public x: number;
  public y: number;
  public context: CanvasRenderingContext2D;

  constructor(x: number, y: number, context: CanvasRenderingContext2D) {
    this.x = x;
    this.y = y;
    this.context = context;
  }

  abstract draw(bouncer?): void; // Must be implemented in derived classes
}
