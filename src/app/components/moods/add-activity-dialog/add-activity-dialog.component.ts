import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ICONS } from 'src/app/shared/model/mood-journal.model';

@Component({
  selector: 'app-add-activity-dialog',
  templateUrl: './add-activity-dialog.component.html',
  styleUrls: ['./add-activity-dialog.component.scss'],
})
export class AddActivityDialogComponent implements OnInit, AfterViewInit {
  formGroup: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    icon: new FormControl('', Validators.required),
  });

  icons = ICONS;
  @ViewChild('nameInput') nameInput: ElementRef;

  constructor(public dialog: MatDialogRef<AddActivityDialogComponent>) {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.nameInput.nativeElement.blur(); // Elimină focalizarea la început
    }, 100);
  }

  ngOnInit(): void {}

  onSave() {
    if (this.formGroup.valid) {
      this.dialog.close(this.formGroup.value);
    } else {
      this.formGroup.markAllAsTouched();
    }
  }
}
