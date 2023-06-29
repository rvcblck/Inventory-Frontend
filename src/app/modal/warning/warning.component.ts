import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-warning',
  templateUrl: './warning.component.html',
  styleUrls: ['./warning.component.css']
})
export class WarningComponent {
  constructor(public dialogRef: MatDialogRef<WarningComponent>, @Inject(MAT_DIALOG_DATA) public data: { message: string; header: string }) {}
}
