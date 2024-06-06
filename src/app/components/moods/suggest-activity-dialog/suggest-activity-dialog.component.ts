import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-suggest-activity-dialog',
  templateUrl: './suggest-activity-dialog.component.html',
  styleUrls: ['./suggest-activity-dialog.component.scss'],
})
export class SuggestActivityDialogComponent implements OnInit, AfterViewInit {
  activities: string;

  constructor(
    public dialog: MatDialogRef<SuggestActivityDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) {
    this.activities = data.activities;
  }

  ngAfterViewInit(): void {}

  ngOnInit(): void {}
}
