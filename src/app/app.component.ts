import { Component, AfterContentInit } from '@angular/core';

import { AppConstants } from './app.constants';
import { Packet } from './classes/Packet';
import { Firewall } from './classes/Firewall';
import { Utils, Vector2D } from './classes/Utils';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterContentInit {
  public static wayX = 1;
  public static wayY = 1;
  public movement = new Vector2D();

  public game: HTMLCanvasElement;
  public context: CanvasRenderingContext2D;

  private packet: Packet;
  private firewall: Firewall;

  private shakeTime = 150;
  private shakeTickStart = -1;
  private hitRight;
  private hitLeft;
  private erpRight = 0;
  private erpLeft = 1;

  ngAfterContentInit() {
    this.game = <HTMLCanvasElement>document.getElementById('breakout');
    this.game.setAttribute('width', String(AppConstants.GAME_WIDTH));
    this.game.setAttribute('height', String(AppConstants.GAME_HEIGHT));
    this.context = this.game.getContext('2d');

    this.firewall = new Firewall(this.context);
    this.packet = new Packet(250, 250, this.context);
    this.gameLoop();
  }

  // Retain scope (this) using Lambda expression.
  gameLoop = () => {
    /*
    deltaTime = (new Date().getTime() - lastTime) / 1000;
    lastTime = Date.now();
    */
    requestAnimationFrame(this.gameLoop);
    this.context.clearRect(0, 0, AppConstants.GAME_WIDTH, AppConstants.GAME_HEIGHT);
    this.context.fillStyle = 'black';
    this.context.fillRect(0, 0, AppConstants.GAME_WIDTH, AppConstants.GAME_HEIGHT);

    // Trigonometry - calculate direction in radians and multiply with speed
    // This allows us to keep constant ball speed
    const angle = Math.atan2(AppComponent.wayY, AppComponent.wayX);
    this.packet.x += Math.cos(angle) * AppConstants.START_SPEED;
    this.packet.y += Math.sin(angle) * AppConstants.START_SPEED;

    this.cameraShake();

    //#region Bounds check
    if (this.packet.x > AppConstants.GAME_WIDTH - AppConstants.PACKET_RADIUS) {
      AppComponent.wayX = -AppComponent.wayX;
      this.hitRight = true;
    }

    if (this.packet.y > AppConstants.GAME_HEIGHT - AppConstants.PACKET_RADIUS) {
      AppComponent.wayY = -AppComponent.wayY;
    }

    if (this.packet.x < AppConstants.PACKET_RADIUS) {
      AppComponent.wayX = -AppComponent.wayX;
      this.hitLeft = true;
    }

    if (this.packet.y < AppConstants.PACKET_RADIUS) {
      AppComponent.wayY = -AppComponent.wayY;
    }
    //#endregion

    if (this.hitRight) {
      if (AppConstants.SHAKE_ON_BOUNDS_HIT && this.shakeTickStart === -1) {
        this.shakeTickStart = Date.now();
      }

      this.context.beginPath();
      this.context.fillStyle = 'rgba(255, 255, 255, ' + Utils.easeOutQuad(1 - this.erpRight) + ')';

      const animation = Utils.easeOutQuad(1 - this.erpRight);
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
      if (AppConstants.SHAKE_ON_BOUNDS_HIT && this.shakeTickStart === -1) {
        this.shakeTickStart = Date.now();
      }

      this.context.beginPath();
      this.context.fillStyle = 'rgba(255, 255, 255, ' + Utils.easeOutQuad(this.erpLeft) + ')';

      const animation = Utils.easeOutQuad(this.erpLeft);
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

    this.packet.draw();
    this.firewall.draw(); // Pass packet position for collision detection

    /*if (this.intersects(packetX, packetY, 5 + 55 * x, 5 + 25 * y, 50, 20)) {
      AppComponent.wayX = -AppComponent.wayX;
      AppComponent.wayY = -AppComponent.wayY;
    }*/

    if (this.shakeTickStart !== -1) {
      this.restoreCamera();
    }
  }

  cameraShake() {
    if (this.shakeTickStart === -1) {
      return;
    }

    const tick = Date.now() - this.shakeTickStart;
    if (tick > this.shakeTime) {
      this.shakeTickStart = -1;
      return;
    }

    const easing = Math.pow(tick / this.shakeTime - 1, 3) + 1;
    this.context.save();
    const shakeX = easing * (Math.cos(tick * 0.1) + Math.cos(tick * 0.3115)) * 2;
    const shakeY = easing * (Math.sin(tick * 0.05) + Math.sin(tick * 0.057113)) * 2;
    this.context.translate(shakeX, shakeY);
  }

  // To be finished
  virusPreShake() {
    this.context.save();
    this.context.translate(Math.random() * 20, Math.random() * 20);
  }

  restoreCamera() {
    this.context.restore();
  }
}
