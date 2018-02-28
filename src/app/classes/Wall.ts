export class Wall {
  public x: number;
  public y: number;
  public width: number;
  public height: number;
  public active: boolean;

  constructor(x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.active = true;
  }
}
