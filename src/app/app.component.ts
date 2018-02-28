import { Component, AfterContentInit, HostListener } from '@angular/core';

import { AppConstants } from './app.constants';
import { Packet } from './classes/Packet';
import { Firewall } from './classes/Firewall';
import { Bouncer } from './classes/Bouncer';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterContentInit {
  public game: HTMLCanvasElement;
  public context: CanvasRenderingContext2D;

  private packet: Packet;
  private firewall: Firewall;
  private bouncer: Bouncer;

  private movement = [];

  private shakeTime = 150;
  private shakeTickStart = -1;

  ngAfterContentInit() {
    this.game = <HTMLCanvasElement>document.getElementById('breakout');
    this.game.setAttribute('width', String(AppConstants.GAME_WIDTH));
    this.game.setAttribute('height', String(AppConstants.GAME_HEIGHT));
    this.context = this.game.getContext('2d');

    this.firewall = new Firewall(this.context);
    this.bouncer = new Bouncer(this.context);
    const packetX = this.bouncer.x + AppConstants.BOUNCER_WIDTH / 2,
          packetY = this.bouncer.y - AppConstants.PACKET_RADIUS - 5;
    this.packet = new Packet(packetX, packetY, this.context);
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

    this.cameraShake();

    this.bouncer.draw();
    this.packet.draw(this.bouncer); // Pass bouncer position
    this.firewall.draw();

    // UI
    // TODO

    // Circuit board
    /*this.context.beginPath();
    this.context.lineWidth = 2;
    this.context.strokeStyle = 'white';
    this.context.moveTo(AppConstants.GAME_WIDTH / 3, AppConstants.GAME_HEIGHT);
    this.context.lineTo(AppConstants.GAME_WIDTH / 3, 100);
    this.context.stroke();
    this.context.closePath();*/

    if (this.shakeTickStart !== -1) {
      this.restoreCamera();
    }
  }

  @HostListener('window:keydown', ['$event'])
  @HostListener('window:keyup', ['$event'])
  onKeyEvent(event: KeyboardEvent) {
    this.bouncer.onKeyChange(event, event.type === 'keydown' ? true : false);
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

  getHealth() {
    return Packet.health;
  }
}
