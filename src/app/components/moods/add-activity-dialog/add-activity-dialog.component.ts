import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { ICONS } from 'src/app/shared/model/mood-journal.model';
import { MoodJournalService } from 'src/app/shared/services/mood-journal.service';

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

  constructor(
    public dialog: MatDialogRef<AddActivityDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.nameInput.nativeElement.blur(); // Elimină focalizarea la început
    }, 100);
  }

  ngOnInit(): void {}

  onSave() {
    if (this.formGroup.valid && this.isActivityNameUnique()) {
      this.dialog.close(this.formGroup.value);
    } else {
      this.formGroup.markAllAsTouched();
    }
  }

  isActivityNameUnique() {
    const act = this.data.activities;
    if (
      this.data.activities.some(
        (a) => a.name.toLowerCase() === this.formGroup.value.name.toLowerCase()
      )
    ) {
      this.formGroup.get('name').setErrors({ uniqueError: true });
      return false;
    } else {
      this.clearUniqueError();
      return true;
    }
  }

  clearUniqueError(): void {
    const control = this.formGroup.get('name');
    if (control.errors) {
      const errors = { ...control.errors };
      delete errors['uniqueError'];
      if (Object.keys(errors).length === 0) {
        control.setErrors(null); // Dacă nu mai sunt alte erori, setează null
      } else {
        control.setErrors(errors); // Altfel, setează noul obiect de erori
      }
    }
  }
}
