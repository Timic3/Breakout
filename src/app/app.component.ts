import { Component, AfterContentInit } from '@angular/core';

import { AppConstants } from './app.constants';
import { Packet } from './classes/Packet';
import { Firewall } from './classes/Firewall';
import { Utils } from './classes/Utils';

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

  private wayX = Math.random() * 25;
  private wayY = Math.random() * 25;

  private hitRight;
  private interpolation = 0;

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
      this.hitRight = true;
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

    if (this.hitRight) {
      this.context.beginPath();
      /*this.context.moveTo(AppConstants.GAME_WIDTH - 5, (AppConstants.GAME_HEIGHT / 2) * (1 - this.interpolation));
      this.context.lineWidth = 5;
      this.context.strokeStyle = 'rgb(255, 255, 255, ' + this.interpolation + ')';
      // (AppConstants.GAME_HEIGHT / 2) + (AppConstants.GAME_HEIGHT / 2) * (this.interpolation)
      this.context.lineTo(AppConstants.GAME_WIDTH - 5,  (AppConstants.GAME_HEIGHT / 2) * (1 + this.interpolation));
      this.context.stroke();*/
      const animation = Utils.easeInOutCubic(1 - this.interpolation);
      this.context.fillStyle = 'rgba(255, 255, 255, ' + (1 - this.interpolation + 0.25) + ')';
      //this.context.arc(0, 0, 120, 0, Math.PI * 2);
      this.context.ellipse(AppConstants.GAME_WIDTH + 45 * animation, AppConstants.GAME_HEIGHT / 2, 50, AppConstants.GAME_HEIGHT / 2, 0, 0, Math.PI * 2);
      this.context.fill();
      this.context.closePath();
      this.interpolation += 0.07;
      if (this.interpolation >= 1) {
        this.hitRight = false;
        this.interpolation = 0;
      }
    }

    this.packet.draw();
    // this.firewall.draw();
  }
}
