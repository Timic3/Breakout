import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';

import { AppStates } from '../app.states';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss']
})
export class LeaderboardComponent {
  public scores = [];

  constructor(public dialogRef: MatDialogRef<LeaderboardComponent>) {
    this.loadScores();
  }

  public static saveScore(newScore) {
    // Very badly scripted. I was in a hurry :)
    const leaderboard = localStorage.getItem('leaderboard');
    let temporaryScores = [];
    if (leaderboard) {
      temporaryScores = JSON.parse(leaderboard);
    }
    let found = false;
    for (let i = 0; i < temporaryScores.length; i++) {
      const score = temporaryScores[i];
      if (score.name === AppStates.NAME) {
        if (newScore > score.score) {
          score.score = newScore;
        }
        found = true;
        break;
      }
    }
    if (!found) {
      temporaryScores.push({ name: AppStates.NAME, score: newScore });
    }
    localStorage.setItem('leaderboard', JSON.stringify(temporaryScores));
  }

  loadScores() {
    const rawLeaderboard = localStorage.getItem('leaderboard');

    let leaderboard = [];
    if (rawLeaderboard) {
      leaderboard = JSON.parse(rawLeaderboard);
    }

    /*for (let i = 0; i < 5; i++) {
      this.scores[i] = { name: 'John' + Math.round(Math.random() * 255), score: Math.round(Math.random() * 100) };
    }
    this.scores.sort((a, b) => b.score - a.score);*/

    // Very badly scripted. I was in a hurry :)
    leaderboard.sort((a, b) => b.score - a.score);
    for (let i = 0; i < 5; i++) {
      if (leaderboard[i]) {
        this.scores[i] = { name: leaderboard[i].name, score: leaderboard[i].score };
      }
    }
  }

  getLoggedIn() {
    return AppStates.NAME;
  }

}
