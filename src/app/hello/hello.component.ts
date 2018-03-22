import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-hello',
  templateUrl: './hello.component.html',
  styleUrls: ['./hello.component.scss']
})
export class HelloComponent {
  public nameError;

  constructor(public dialogRef: MatDialogRef<HelloComponent>) { }

  confirm(nameInput) {
    if (!nameInput.value.trim()) {
      this.nameError = true;
      return;
    }
    this.dialogRef.close(nameInput.value);
  }

}
