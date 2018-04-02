import { Component, AfterContentInit, HostListener } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material';

import { HelloComponent } from './hello/hello.component';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { EndComponent } from './end/end.component';
import { InfoComponent } from './info/info.component';

import { AppConstants } from './app.constants';
import { AppStates } from './app.states';
import { Packet } from './classes/Packet';
import { Firewall } from './classes/Firewall';
import { Bouncer } from './classes/Bouncer';
import { Easing, Version } from './classes/Utils';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterContentInit {
  public static LATEST_VERSION = 'Server error';
  public static OUTDATED = false;

  public game: HTMLCanvasElement;
  public context: CanvasRenderingContext2D;

  private packet: Packet;
  private firewall: Firewall;
  private bouncer: Bouncer;

  private movement = [];

  private shakeTime = 150;
  private shakeTickStart = -1;

  public now;
  public then;
  public elapsed;

  public gameFPS = 60;

  public gameStarting;

  public circleStep = 0;
  public circleAnimation = 0;
  public circleExpand = 0;

  public levelUp;
  public levelUpSize = 0;

  public heart;
  public helloScreen = true;

  constructor(public dialog: MatDialog, private http: HttpClient) { }

  ngAfterContentInit() {
    this.game = <HTMLCanvasElement>document.getElementById('breakout');
    this.game.setAttribute('width', String(AppConstants.GAME_WIDTH));
    this.game.setAttribute('height', String(AppConstants.GAME_HEIGHT + 40));
    this.context = this.game.getContext('2d');

    this.heart = new Image();
    this.heart.src = 'assets/images/heart.png';

    this.firewall = new Firewall(this.context);
    this.bouncer = new Bouncer(this.context);
    const packetX = this.bouncer.x + AppConstants.BOUNCER_WIDTH / 2,
          packetY = this.bouncer.y - AppConstants.PACKET_RADIUS - 5;
    this.packet = new Packet(packetX, packetY, this.bouncer, this.context);
    this.then = Date.now();

    this.fetchVersion();
    this.initiateHelloScreen();

    this.gameLoop();
  }

  // Retain scope (this) using Lambda expression.
  gameLoop = () => {
    requestAnimationFrame(this.gameLoop);
    this.now = Date.now();
    this.elapsed = this.now - this.then;
    if (this.elapsed > 1000 / this.gameFPS) {
      this.then = this.now - (this.elapsed % (1000 / this.gameFPS));

      if (this.gameStarting) {
        this.levelUpSize -= 0.03;
        if (this.levelUpSize <= 0) {
          this.levelUpSize = 0;
        }
        if (this.circleStep === 0) {
          this.circleAnimation += 0.05;
          if (this.circleAnimation >= 2) {
            this.circleAnimation = 2;
            this.circleStep = 1;
            AppStates.STARTED = true;
          }
        } else if (this.circleStep === 1) {
          this.circleExpand += 0.05;
          if (this.circleExpand >= 1) {
            this.circleExpand = 1;
            this.gameStarting = false;
          }
        }
      }

      // Really bad right now... I'm in a hurry :)
      if (AppStates.CHANGING_STAGE) {
        AppStates.CHANGING_STAGE = false;
        this.circleStep = 0;
        this.circleAnimation = 0;
        this.circleExpand = 0;
        if (AppStates.STAGE !== 1) {
          this.levelUp = true;
        }
      }

      // BAD AGAIN
      if (AppStates.ENDED) {
        AppStates.ENDED = false;
        this.openEnd(AppStates.SCORE);
        AppStates.SCORE = 0;
      }

      if (this.levelUp) {
        this.levelUpSize += 0.03;
        if (this.levelUpSize >= 1) {
          this.levelUpSize = 1;
          this.levelUp = false;
        }
      }

      this.context.clearRect(0, 0, AppConstants.GAME_WIDTH, AppConstants.GAME_HEIGHT + 40);
      this.context.fillStyle = 'rgba(16, 16, 16, 0.5)';
      this.context.fillRect(0, 0, AppConstants.GAME_WIDTH, AppConstants.GAME_HEIGHT + 40);

      // this.cameraShake();

      this.context.font = '85px Ubuntu';
      this.context.textAlign = 'center';
      this.context.fillStyle = 'rgba(111, 111, 111, 1.0)';
      this.context.fillText(String(AppStates.STAGE), AppConstants.HALF_WIDTH, AppConstants.HALF_HEIGHT, AppConstants.GAME_WIDTH);

      this.context.font = (Easing.easeInOutCubic(this.levelUpSize) * 50) + 'px Ubuntu';
      this.context.fillStyle = 'rgba(255, 255, 255, ' + this.levelUpSize + ')';
      this.context.fillText('Level up!', AppConstants.HALF_WIDTH, AppConstants.HALF_HEIGHT - 130, AppConstants.GAME_WIDTH);

      this.context.beginPath();
      this.context.strokeStyle = 'rgba(111, 111, 111, ' + (1 - this.circleExpand) + ')';
      this.context.lineWidth = 15;
      const radius = 70 + 20 * this.circleExpand;
      const startAngle = -Math.PI / 2;
      const endAngle = startAngle + (Math.PI) * this.circleAnimation;
      this.context.arc(AppConstants.HALF_WIDTH, AppConstants.HALF_HEIGHT - 30, radius, startAngle, endAngle);
      this.context.stroke();
      this.context.closePath();

      this.context.font = '25px Ubuntu';
      this.context.fillStyle = 'rgba(255, 255, 255, 1.0)';
      if (!this.gameStarting && !AppStates.STARTED) {
        this.context.fillText('Press SPACE to begin', AppConstants.HALF_WIDTH, AppConstants.HALF_HEIGHT + 100, AppConstants.GAME_WIDTH);
      }

      this.bouncer.draw();
      this.firewall.draw();
      this.packet.draw();

      // UI

      this.context.font = '25px Ubuntu';
      this.context.textAlign = 'left';
      this.context.fillStyle = 'rgba(255, 255, 255, 1.0)';
      this.context.fillText('Score: ' + AppStates.SCORE, 5, AppConstants.GAME_HEIGHT + 32, AppConstants.GAME_WIDTH);

      for (let i = 0; i < Packet.health; i++) {
        this.context.drawImage(this.heart, (AppConstants.GAME_WIDTH - 40) - 40 * i, AppConstants.GAME_HEIGHT, 32, 32);
      }

      // Circuit board
      /*this.context.beginPath();
      this.context.lineWidth = 2;
      this.context.strokeStyle = 'white';
      this.context.moveTo(AppConstants.GAME_WIDTH / 3, AppConstants.GAME_HEIGHT);
      this.context.lineTo(AppConstants.GAME_WIDTH / 3, 100);
      this.context.stroke();
      this.context.closePath();*/

      /*if (this.shakeTickStart !== -1) {
        this.restoreCamera();
      }*/
    }
  }

  @HostListener('window:keydown', ['$event'])
  @HostListener('window:keyup', ['$event'])
  onKeyEvent(event: KeyboardEvent) {
    this.bouncer.onKeyChange(event, event.type === 'keydown' ? true : false);

    if (event.keyCode === 32 && !this.helloScreen) {
      // Prevent from firing focused Material element
      event.preventDefault();
      this.gameStarting = true;
    }
  }

  fetchVersion() {
    this.http.get('https://api.github.com/repos/Timic3/Breakout/releases/latest')
      .subscribe(
        (data: any) => {
          AppStates.LATEST_VERSION = data.tag_name;
          console.log('Current version: ' + AppConstants.APP_VERSION);
          console.log('Latest GitHub version: ' + data.tag_name);
          const compareVersions = Version.compare(AppConstants.APP_VERSION, data.tag_name);
          console.log('Semantic version comparator: ' + compareVersions);
          if (compareVersions < 0) {
            console.log('You are using outdated version! Update here: https://github.com/Timic3/Breakout/releases/latest');
            AppStates.OUTDATED = true;
          }
        },
        (error: HttpErrorResponse) => {
          console.log('An error occurred while fetching version.');
          console.log('Error: ' + error.status + ' (' + error.statusText + ')');
          console.log('Report to: https://github.com/Timic3/Maze/issues');
        });
  }

  initiateHelloScreen() {
    setTimeout(() => {
      const dialog = this.dialog.open(HelloComponent, {
        width: '500px',
        disableClose: true
      });

      dialog.afterClosed()
        .subscribe((nameInput) => {
          AppStates.NAME = nameInput;
          this.helloScreen = false;
        });
    });
  }

  openLeaderboard() {
    const dialog = this.dialog.open(LeaderboardComponent, {
      width: '500px'
    });
  }

  openEnd(endScore) {
    const dialog = this.dialog.open(EndComponent, {
      width: '500px',
      data: {
        score: endScore
      }
    });
  }

  openInfo() {
    const dialog = this.dialog.open(InfoComponent, {
      width: '500px'
    });
  }
}
