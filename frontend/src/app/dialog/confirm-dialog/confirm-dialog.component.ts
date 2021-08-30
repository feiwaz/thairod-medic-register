import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent {

  readonly defaultTitle = 'ยืนยัน';
  readonly defaultContent = 'ท่านต้องการยืนยัน ใช่หรือไม่';

  constructor(
    public dialogRef: MatDialogRef<DeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      title?: string,
      content?: string
    }
  ) {
    if (!this.data.title) {
      this.data.title = this.defaultTitle;
    }
    if (!this.data.content) {
      this.data.content = this.defaultContent;
    }
  }

  onConfirmClicked(): void {
    this.dialogRef.close({ confirm: true });
  }

}
