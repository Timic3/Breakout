import { Component, AfterContentInit } from '@angular/core';

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

  ngAfterContentInit() {
    this.game = <HTMLCanvasElement>document.getElementById('breakout');
    this.context = this.game.getContext('2d');

    this.packet = new Packet(20, 20, this.context);
    this.firewall = new Firewall(this.context);
    this.gameLoop();
  }

  // Retain scope (this) using Lambda expression.
  gameLoop = () => {
    requestAnimationFrame(this.gameLoop);
    this.context.clearRect(0, 0, 500, 500);
    this.context.fillStyle = 'black';
    this.context.fillRect(0, 0, 500, 500);

    this.packet.draw();
    this.firewall.draw();
  }
}
