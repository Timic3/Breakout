import { AppConstants } from './app.constants';

export class AppStates {
  public static STARTED = false;
  public static STAGE = 1;
  public static CHANGING_STAGE = false;

  public static PACKET_SPEED = 10; // 13

  // Number of walls per axis
  public static WALLS_X = 3; // 20
  static readonly WALLS_Y = 3; // 3

  public static WALLS_WIDTH = AppConstants.GAME_WIDTH / AppStates.WALLS_X;
  static readonly WALLS_HEIGHT = 40;
}
