import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import {
  MatButtonModule,
  MatDialogModule,
  MatIconModule,
  MatInputModule
} from '@angular/material';

import { AppComponent } from './app.component';
import { HelloComponent } from './hello/hello.component';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { EndComponent } from './end/end.component';
import { InfoComponent } from './info/info.component';


@NgModule({
  declarations: [
    AppComponent,
    HelloComponent,
    LeaderboardComponent,
    EndComponent,
    InfoComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatInputModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [HelloComponent, LeaderboardComponent, EndComponent, InfoComponent]
})
export class AppModule { }
