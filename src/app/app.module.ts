import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import {
  MatButtonModule,
  MatDialogModule,
  MatIconModule,
  MatInputModule
} from '@angular/material';

import { AppComponent } from './app.component';
import { HelloComponent } from './hello/hello.component';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';


@NgModule({
  declarations: [
    AppComponent,
    HelloComponent,
    LeaderboardComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatInputModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [HelloComponent, LeaderboardComponent]
})
export class AppModule { }
