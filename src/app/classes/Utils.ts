export class Easing {
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
