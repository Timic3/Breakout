export class AppConstants {
  static readonly GAME_WIDTH = 1200;
  static readonly GAME_HEIGHT = 700;

  static readonly START_SPEED = 8;
  static readonly PACKET_RADIUS = 20;

  // Number of walls per axis
  static readonly WALLS_X = 20;
  static readonly WALLS_Y = 3;

  static readonly WALLS_WIDTH = AppConstants.GAME_WIDTH / AppConstants.WALLS_X;
  static readonly WALLS_HEIGHT = 40;

  // Spacing between walls
  static readonly SPACING = 1;

  static readonly SHAKE_ON_BOUNDS_HIT = false;
}
