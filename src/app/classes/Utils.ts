export class Utils {
  public static easeOutSine(t: number) {
    return Math.sin(Math.PI / 2 * t);
  }

  public static easeOutQuad(t: number) {
    return t * t;
  }

  public static easeInOutCubic(t: number) {
    if ((t /= 1 / 2) < 1) {
      return 1 / 2 * t * t * t;
    }
    return 1 / 2 * ((t -= 2) * t * t + 2);
  }

  public static easeElasticOut(t: number) {
    return Math.sin(-13 * (Math.PI / 2) * (t + 1)) * Math.pow(2, -10 * t) + 1;
  }

  public static easeElasticIn(t: number) {
    return Math.sin(13 * (Math.PI / 2) * t) * Math.pow(2, 10 * (t - 1));
  }
}

export class Vector2D {

  private values = new Float32Array(2);

  get x(): number {
      return this.values[0];
  }

  get y(): number {
      return this.values[1];
  }

  get xy(): number[] {
      return [
          this.values[0],
          this.values[1]
      ];
  }

  set x(value: number) {
      this.values[0] = value;
  }

  set y(value: number) {
      this.values[1] = value;
  }

  set xy(values: number[]) {
      this.values[0] = values[0];
      this.values[1] = values[1];
  }

  constructor(values: number[]= null) {
      if (values) {
          this.xy = values;
      }
  }

  reset(): void {
      this.x = 0;
      this.y = 0;
  }

  length(): number {
      return Math.sqrt(this.squaredLength());
  }

  squaredLength(): number {
      const x = this.x,
            y = this.y;

      return (x * x + y * y);
  }

  add(vector: Vector2D): Vector2D {
      this.x += vector.x;
      this.y += vector.y;

      return this;
  }

  subtract(vector: Vector2D): Vector2D {
      this.x -= vector.x;
      this.y -= vector.y;

      return this;
  }

  multiply(vector: Vector2D): Vector2D {
      this.x *= vector.x;
      this.y *= vector.y;

      return this;
  }

  divide(vector: Vector2D): Vector2D {
      this.x /= vector.x;
      this.y /= vector.y;

      return this;
  }

  scale(value: number, dest: Vector2D = null): Vector2D {
      if (!dest) {
        dest = this;
      }

      dest.x *= value;
      dest.y *= value;

      return dest;
  }

  normalize(dest: Vector2D = null): Vector2D {
      if (!dest) {
        dest = this;
      }

      let length = this.length();

      if (length === 1) {
          return this;
      }

      if (length === 0) {
          dest.x = 0;
          dest.y = 0;

          return dest;
      }

      length = 1.0 / length;

      dest.x *= length;
      dest.y *= length;

      return dest;
  }
}
