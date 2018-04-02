import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

import { AppConstants } from '../app.constants';
import { AppStates } from '../app.states';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent {

  constructor(public dialogRef: MatDialogRef<InfoComponent>) { }

  confirm() {
    this.dialogRef.close();
  }

  getCurrentVersion() {
    return AppConstants.APP_VERSION;
  }

  getLatestVersion() {
    return AppStates.LATEST_VERSION;
  }

  isOutdated() {
    return AppStates.OUTDATED;
  }
}
