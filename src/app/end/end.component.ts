import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-end',
  templateUrl: './end.component.html',
  styleUrls: ['./end.component.scss']
})
export class EndComponent {
  public endScore = 0;

  constructor(public dialogRef: MatDialogRef<EndComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.endScore = data.score;
  }

}
