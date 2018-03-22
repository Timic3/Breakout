import { LeaderboardComponent } from '../leaderboard/leaderboard.component';
import { MatDialog } from '@angular/material';

import { AppConstants } from '../app.constants';
import { AppStates } from '../app.states';
import { Drawable } from './Drawable';
import { Firewall } from './Firewall';
import { Bouncer } from './Bouncer';
import { Easing } from './Utils';
import { PacketIP } from './PacketIP';
import { Wall } from './Wall';

export class Packet extends Drawable {
  public static health = 3;

  private velocityX = Math.random() * (Math.floor(Math.random() * 2) === 1 ? 1 : -1);
  private velocityY = -1;

  private angle = Math.atan2(this.velocityY, this.velocityX);
  private angleX = Math.cos(this.angle);
  private angleY = Math.sin(this.angle);

  private hitRight = false;
  private hitLeft = false;
  private erpRight = 0;
  private erpLeft = 1;

  private bounces: PacketIP[] = [];
  private bouncer; // Collider

  constructor(x: number, y: number, bouncer: Bouncer, context: CanvasRenderingContext2D) {
    super(x, y, context);
    this.bouncer = bouncer;
    this.bounces.push(new PacketIP(bouncer.x + AppConstants.BOUNCER_WIDTH / 2, bouncer.y - 5));
  }

  draw() {
    // Trigonometry - calculate direction in radians and multiply with speed
    // This allows us to keep constant ball speed
    if (AppStates.STARTED) {
      this.x += this.angleX * (AppStates.PACKET_SPEED + AppConstants.PROGRESSIVENESS * (AppStates.STAGE - 1));
      this.y += this.angleY * (AppStates.PACKET_SPEED + AppConstants.PROGRESSIVENESS * (AppStates.STAGE - 1));
    }

    for (let x = 0; x < AppStates.WALLS_X; x++) {
      for (let y = 0; y < AppStates.WALLS_Y; y++) {
        const wall = Firewall.list[x][y];
        if (wall.active) {
          this.bounceOnIntersection(wall);
        }
      }
    }

    this.bounceOnBoundsIntersection();

    if (this.x + AppConstants.PACKET_RADIUS > this.bouncer.x &&
        this.x - AppConstants.PACKET_RADIUS < this.bouncer.x + AppConstants.BOUNCER_WIDTH &&
        this.y + AppConstants.PACKET_RADIUS > this.bouncer.y &&
        this.y - AppConstants.PACKET_RADIUS < this.bouncer.y + AppConstants.BOUNCER_HEIGHT) {
          this.velocityY = -this.velocityY;
          // Just a safety check
          this.y = this.bouncer.y - AppConstants.PACKET_RADIUS;
          this.velocityX = (this.x - this.bouncer.x - AppConstants.BOUNCER_WIDTH / 2) / 100;
          this.updateAngle();
          if (this.bounces[0]) {
            this.bounces[0].returnX = this.x;
            this.bounces[0].returnY = this.y;
            this.bounces[0].returned = true;
          }
          this.bounces.push(new PacketIP(this.bouncer.x + AppConstants.BOUNCER_WIDTH / 2, this.bouncer.y - 5));
    }

    if (AppStates.STARTED) {
      for (let i = 0; i < this.bounces.length; i++) {
        const packetIP = this.bounces[i];
        this.context.fillStyle = 'rgba(31, 201, 200, ' + packetIP.uiAlpha + ')';
        this.context.shadowColor = 'black';
        this.context.shadowOffsetX = 1;
        this.context.shadowOffsetY = 1;
        this.context.font = '15px Ubuntu';
        this.context.textAlign = 'center';
        this.context.strokeStyle = 'rgba(255, 255, 255, ' + packetIP.uiAlpha + ')';

        // Source IP
        this.context.beginPath();
        this.context.lineWidth = 2;
        this.context.fillText(packetIP.sourceIP, packetIP.sourceX, packetIP.sourceY, AppConstants.BOUNCER_WIDTH);
        this.context.arc(packetIP.sourceX, packetIP.sourceY - 30, 5, 0, Math.PI * 2);
        this.context.moveTo(packetIP.sourceX, packetIP.sourceY - 30);
        if (!packetIP.hasDestination) { // If packet has no destination, bind it to the packet
          this.context.lineTo(this.x, this.y);
        } else { // However if the packet has a destination, bind it to destination coordinates
          this.context.lineTo(packetIP.destinationX, packetIP.destinationY + 20);
        }
        this.context.stroke();
        this.context.closePath();

        // Destination IP
        if (packetIP.hasDestination) {
          this.context.beginPath();
          this.context.lineWidth = 2;
          this.context.fillText(packetIP.destinationIP, packetIP.destinationX, packetIP.destinationY, AppConstants.BOUNCER_WIDTH);
          this.context.arc(packetIP.destinationX, packetIP.destinationY + 20, 5, 0, Math.PI * 2);
          this.context.moveTo(packetIP.destinationX, packetIP.destinationY + 20);
          if (!packetIP.returned) { // If packet hasn't returned to the bouncer, bind it to the packet
            this.context.lineTo(this.x, this.y);
          } else { // Otherwise, finish the line
            this.context.lineTo(packetIP.returnX, packetIP.returnY - 20);
          }
          this.context.stroke();
          this.context.closePath();

          if (packetIP.returned) {
            this.context.beginPath();
            this.context.arc(packetIP.returnX, packetIP.returnY - 20, 5, 0, Math.PI * 2);
            this.context.stroke();
            this.context.closePath();
            packetIP.uiAlpha -= 0.05;
            if (packetIP.uiAlpha <= 0) {
              this.bounces.splice(i, 1);
            }
          }
        }

      }
    }

    this.context.beginPath();
    this.context.fillStyle = 'rgb(255, 255, 255)';
    this.context.arc(this.x, this.y, AppConstants.PACKET_RADIUS, 0, Math.PI * 2);
    this.context.fill();
    this.context.closePath();
  }

  updateAngle() {
    this.angle = Math.atan2(this.velocityY, this.velocityX);
    this.angleX = Math.cos(this.angle);
    this.angleY = Math.sin(this.angle);
  }

  managePacketIP(lost?) {
    if (this.bounces.length === 1) {
      const bounce = this.bounces[0];
      if (!bounce.hasDestination) {
        if (lost) {
          bounce.destinationIP = 'Packet redirected';
        } else {
          const range1 = Math.ceil(Math.random() * 255);
          const range2 = Math.floor(Math.random() * 255);
          const range3 = Math.floor(Math.random() * 255);
          const range4 = Math.floor(Math.random() * 255);
          bounce.destinationIP = range1 + '.' + range2 + '.' + range3 + '.' + range4;
        }
        bounce.destinationX = this.x;
        bounce.destinationY = this.y + (lost ? 10 : 0); // AppConstants.WALLS_Y * (AppConstants.WALLS_HEIGHT + AppConstants.SPACING) + 30;
        bounce.hasDestination = true;
      }
    }
  }

  manageWallHit(wall) {
    wall.active = false;
    this.managePacketIP();

    if (this.checkForWalls()) {
      AppStates.STARTED = false;
      AppStates.STAGE++;
      Packet.health++;
      AppStates.WALLS_X += 2;
      AppStates.WALLS_WIDTH = AppConstants.GAME_WIDTH / AppStates.WALLS_X;
      AppStates.CHANGING_STAGE = true;
      this.reset(true);
    }
  }

  checkForWalls() {
    for (let x = 0; x < AppStates.WALLS_X; x++) {
      for (let y = 0; y < AppStates.WALLS_Y; y++) {
        if (Firewall.list[x][y].active) {
          return false;
        }
      }
    }
    return true;
  }

  reset(hardReset?) {
    if (hardReset) {
      Firewall.list = [];
      for (let x = 0; x < AppStates.WALLS_X; x++) {
        Firewall.list[x] = [];
        for (let y = 0; y < AppStates.WALLS_Y; y++) {
          Firewall.list[x][y] = new Wall(
            x * AppStates.WALLS_WIDTH + AppConstants.SPACING,
            y * AppStates.WALLS_HEIGHT + AppConstants.SPACING,
            AppStates.WALLS_WIDTH - AppConstants.SPACING * 2,
            AppStates.WALLS_HEIGHT - AppConstants.SPACING * 2
          );
        }
      }
    }
    this.bounces = [];
    this.bouncer.x = (AppConstants.GAME_WIDTH - AppConstants.BOUNCER_WIDTH) / 2;
    this.bouncer.y = AppConstants.GAME_HEIGHT - AppConstants.BOUNCER_HEIGHT - 10;
    this.x = this.bouncer.x + AppConstants.BOUNCER_WIDTH / 2;
    this.y = this.bouncer.y - AppConstants.PACKET_RADIUS - 5;
    if (!hardReset) {
      this.bounces.push(new PacketIP(this.bouncer.x + AppConstants.BOUNCER_WIDTH / 2, this.bouncer.y - 5));
    }
  }

  bounceOnIntersection(wall) {
    const wallX = wall.x,
          wallY = wall.y,
          wallWidth = wall.width,
          wallHeight = wall.height;
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
        this.velocityX = normalX;
      } else if (Math.abs(sideY) < AppConstants.PACKET_RADIUS && sideX < 0) {
        const normalY = packetDistanceY * sideY < 0 ? -1 : 1;
        this.velocityY = normalY;
      }
      this.updateAngle();
      this.manageWallHit(wall);
      return; // Yes, bounced!
    }

    // Circle is near the corner
    if (!AppConstants.EXPERIMENTAL_COLLISION) {
      return;
    }
    if (!(sideX * sideX + sideY * sideY < AppConstants.PACKET_RADIUS * AppConstants.PACKET_RADIUS)) {
      return; // No bounce
    }
    const normalize = Math.sqrt(sideX * sideX + sideY * sideY);
    const vectorX = packetDistanceX < 0 ? -1 : 1,
          vectorY = packetDistanceY < 0 ? -1 : 1;
    this.velocityX = vectorX * sideX / normalize;
    this.velocityY = vectorY * sideY / normalize;
    this.updateAngle();
    this.manageWallHit(wall);
    return; // Yes, bounced!
  }

  bounceOnBoundsIntersection() {
    if (this.x > AppConstants.GAME_WIDTH - AppConstants.PACKET_RADIUS) {
      this.velocityX = -this.velocityX;
      this.updateAngle();
      this.hitRight = true;
      // Don't bug out!
      this.x = AppConstants.GAME_WIDTH - AppConstants.PACKET_RADIUS;
    }

    if (this.y >= AppConstants.GAME_HEIGHT - AppConstants.PACKET_RADIUS) {
      this.velocityX = Math.random() * (Math.floor(Math.random() * 2) === 1 ? 1 : -1);
      this.velocityY = -this.velocityY;
      this.updateAngle();

      for (let i = 0; i < this.bounces.length; i++) {
        const packetIP = this.bounces[i];
        packetIP.returned = true;
      }

      this.bounces.push(new PacketIP(this.bouncer.x + AppConstants.BOUNCER_WIDTH / 2, this.bouncer.y - 5));

      // Packet lost
      if (--Packet.health <= 0) {
        // Reset game
        AppStates.STARTED = false;
        LeaderboardComponent.saveScore(AppStates.STAGE);
        AppStates.ENDED = true;
        AppStates.STAGE = 1;
        AppStates.WALLS_X = 3;
        AppStates.WALLS_WIDTH = AppConstants.GAME_WIDTH / AppStates.WALLS_X;
        AppStates.CHANGING_STAGE = true;
        this.reset(true);
        Packet.health = 3;
      }
      this.reset();
    }

    if (this.x < AppConstants.PACKET_RADIUS) {
      this.velocityX = -this.velocityX;
      this.updateAngle();
      this.hitLeft = true;
      // Bug check
      this.x = AppConstants.PACKET_RADIUS;
    }

    if (this.y < AppConstants.PACKET_RADIUS) {
      this.velocityY = -this.velocityY;
      this.updateAngle();
      this.managePacketIP(true);
      // Bug check
      this.y = AppConstants.PACKET_RADIUS;
    }

    if (this.hitRight) {
      /*if (AppConstants.SHAKE_ON_BOUNDS_HIT && this.shakeTickStart === -1) {
        this.shakeTickStart = Date.now();
      }*/

      this.context.beginPath();
      this.context.fillStyle = 'rgba(255, 255, 255, ' + Easing.easeOutQuad(1 - this.erpRight) + ')';

      const animation = Easing.easeOutQuad(1 - this.erpRight);
      const X = AppConstants.GAME_WIDTH + 45 * animation;
      const Y = AppConstants.GAME_HEIGHT / 2;
      const HIT_Y = AppConstants.GAME_HEIGHT / 2;
      this.context.ellipse(X, HIT_Y, 45, Y, 0, 0, Math.PI * 2);

      this.context.fill();
      this.context.closePath();
      this.erpRight += 0.05;
      if (this.erpRight >= 1) {
        this.hitRight = false;
        this.erpRight = 0;
      }
    }

    if (this.hitLeft) {
      /*if (AppConstants.SHAKE_ON_BOUNDS_HIT && this.shakeTickStart === -1) {
        this.shakeTickStart = Date.now();
      }*/

      this.context.beginPath();
      this.context.fillStyle = 'rgba(255, 255, 255, ' + Easing.easeOutQuad(this.erpLeft) + ')';

      const animation = Easing.easeOutQuad(this.erpLeft);
      const X = -45 * animation;
      const Y = AppConstants.GAME_HEIGHT / 2;
      const HIT_Y = AppConstants.GAME_HEIGHT / 2;
      this.context.ellipse(X, HIT_Y, 45, Y, 0, 0, Math.PI * 2);

      this.context.fill();
      this.context.closePath();
      this.erpLeft -= 0.05;
      if (this.erpLeft <= 0) {
        this.hitLeft = false;
        this.erpLeft = 1;
      }
    }
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
