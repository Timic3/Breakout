export class AppConstants {
  // Application version
  static readonly APP_VERSION = '1.0.0';

  static readonly GAME_WIDTH = 1200;
  static readonly GAME_HEIGHT = 700;

  static readonly HALF_WIDTH = AppConstants.GAME_WIDTH / 2;
  static readonly HALF_HEIGHT = AppConstants.GAME_HEIGHT / 2;

  static readonly PACKET_RADIUS = 15;

  static readonly BOUNCER_WIDTH = 150;
  static readonly BOUNCER_HEIGHT = 10;
  static readonly BOUNCER_SPEED = 15;

  static readonly PROGRESSIVENESS = 1.5;

  // Spacing between walls
  static readonly SPACING = 1;

  static readonly SHAKE_ON_BOUNDS_HIT = false;

  static readonly EXPERIMENTAL_COLLISION = true;
}
