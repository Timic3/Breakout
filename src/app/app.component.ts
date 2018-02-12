import { Component, AfterContentInit } from '@angular/core';

import { AppConstants } from './app.constants';
import { Packet } from './classes/Packet';
import { Firewall } from './classes/Firewall';

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

  private wayX = Math.random() * 15;
  private wayY = Math.random() * 15;

  ngAfterContentInit() {
    this.game = <HTMLCanvasElement>document.getElementById('breakout');
    this.game.setAttribute('width', String(AppConstants.GAME_WIDTH));
    this.game.setAttribute('height', String(AppConstants.GAME_HEIGHT));
    this.context = this.game.getContext('2d');

    this.packet = new Packet(250, 250, this.context);
    this.firewall = new Firewall(this.context);
    this.gameLoop();
  }

  // Retain scope (this) using Lambda expression.
  gameLoop = () => {
    requestAnimationFrame(this.gameLoop);
    this.context.clearRect(0, 0, AppConstants.GAME_WIDTH, AppConstants.GAME_HEIGHT);
    this.context.fillStyle = 'black';
    this.context.fillRect(0, 0, AppConstants.GAME_WIDTH, AppConstants.GAME_HEIGHT);

    this.packet.x += this.wayX;
    this.packet.y += this.wayY;

    /*if (this.packet.x > 500) {
      this.wayX = -this.wayX;
    }

    if (this.packet.y > 500) {
      this.wayY = -this.wayY;
    }

    if (this.packet.x < 0) {
      this.wayX = -this.wayX;
    }

    if (this.packet.y < 0) {
      this.wayY = -this.wayY;
    }*/

    // const boundsXDistance = Math.abs(this.packet.x - 500);
    // if (10 * 10 >= Math.pow((boundsXDistance - 250) + (100000), 2)) {
    if (this.packet.x > AppConstants.GAME_WIDTH - AppConstants.PACKET_RADIUS) {
      this.wayX = -this.wayX;
    }

    if (this.packet.y > AppConstants.GAME_HEIGHT - AppConstants.PACKET_RADIUS) {
      this.wayY = -this.wayY;
    }

    if (this.packet.x < AppConstants.PACKET_RADIUS) {
      this.wayX = -this.wayX;
    }

    if (this.packet.y < AppConstants.PACKET_RADIUS) {
      this.wayY = -this.wayY;
    }

    this.packet.draw();
    // this.firewall.draw();
  }
}
