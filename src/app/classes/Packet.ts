import { AppConstants } from '../app.constants';
import { AppComponent } from '../app.component';
import { Drawable } from './Drawable';
import { Firewall } from './Firewall';

export class Packet extends Drawable {
  constructor(x: number, y: number, context: CanvasRenderingContext2D) {
    super(x, y, context);
  }

  draw() {
    this.context.beginPath();
    this.context.fillStyle = 'rgb(255, 255, 255)';
    this.context.arc(this.x, this.y, AppConstants.PACKET_RADIUS, 0, Math.PI * 2);
    this.context.fill();
    this.context.closePath();
    for (let x = 0; x < AppConstants.WALLS_X; x++) {
      for (let y = 0; y < AppConstants.WALLS_Y; y++) {
        /*if (this.intersects(wallX, wallY, wallWidth, wallHeight)) {
          Firewall.list[coordX][coordY].x = -999;
          AppComponent.wayY = -AppComponent.wayY;
        }*/
        this.bounceOnIntersection(x, y);
      }
    }
  }

  bounceOnIntersection(x, y) {
    const wallX = Firewall.list[x][y].x,
          wallY = Firewall.list[x][y].y,
          wallWidth = Firewall.list[x][y].width,
          wallHeight = Firewall.list[x][y].height;
    // Center-to-center vector
    const packetDistanceX = this.x - wallX - wallWidth / 2,
          packetDistanceY = this.y - wallY - wallHeight / 2;
    // Check if it's in rectangle quadrant
    const sideX = Math.abs(packetDistanceX) - wallWidth / 2,
          sideY = Math.abs(packetDistanceY) - wallHeight / 2;
    if (sideX > AppConstants.PACKET_RADIUS || sideY > AppConstants.PACKET_RADIUS) { // Outside
      // No bounce
      return;
    }
    if (sideX < -AppConstants.PACKET_RADIUS && sideY < -AppConstants.PACKET_RADIUS) { // Inside
      // No bounce
      return;
    }

    if (sideX < 0 || sideY < 0) { // Intersects side or corner
      if (Math.abs(sideX) < AppConstants.PACKET_RADIUS && sideY < 0) {
        const normalX = packetDistanceX * sideX < 0 ? -1 : 1;
        AppComponent.wayX = normalX;
      } else if (Math.abs(sideY) < AppConstants.PACKET_RADIUS && sideX < 0) {
        const normalY = packetDistanceY * sideY < 0 ? -1 : 1;
        AppComponent.wayY = normalY;
      }
      Firewall.list[x][y].x = -99999;
      return; // Yes, bounced!
    }

    // Circle is near the corner
    if (!(sideX * sideX + sideY * sideY < AppConstants.PACKET_RADIUS * AppConstants.PACKET_RADIUS)) {
      return; // No bounce
    }
    const normalize = Math.sqrt(sideX * sideX + sideY * sideY);
    const vectorX = packetDistanceX < 0 ? -1 : 1,
          vectorY = packetDistanceY < 0 ? -1 : 1;
    AppComponent.wayX = vectorX * sideX / normalize;
    AppComponent.wayY = vectorY * sideY / normalize;
    Firewall.list[x][y].x = -99999;
    return; // Yes, bounced!
  }

  /*intersects(wallX, wallY, wallWidth, wallHeight) {
    const packetDistanceX = Math.abs(this.x - wallX - wallWidth / 2),
          packetDistanceY = Math.abs(this.y - wallY - wallHeight / 2);
    if (packetDistanceX > (wallWidth / 2 + AppConstants.PACKET_RADIUS)) {
      return false;
    }
    if (packetDistanceY > (wallHeight / 2 + AppConstants.PACKET_RADIUS)) {
      return false;
    }

    if (packetDistanceX <= (wallWidth / 2)) {
      return true;
    }
    if (packetDistanceY <= (wallHeight / 2)) {
      return true;
    }

    const cornerDistanceX = packetDistanceX - wallWidth / 2,
          cornerDistanceY = packetDistanceY - wallHeight / 2;
    const cornerDistanceSquared = cornerDistanceX * cornerDistanceX + cornerDistanceY * cornerDistanceY;
    return (cornerDistanceSquared <= (AppConstants.PACKET_RADIUS * AppConstants.PACKET_RADIUS));
  }*/
}
