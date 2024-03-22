import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { forkJoin } from 'rxjs';
import { Anim1, Anim2 } from 'src/animations';
import {
  ActivityDTO,
  DATE_FORMATS2,
  DATE_FORMATS3,
  Mood,
  User,
  date_db_format,
  date_key_format,
  date_time_format,
} from 'src/app/shared/model/mood-journal.model';
import {
  MoodJournalService,
  MoodsPageSize,
} from 'src/app/shared/services/mood-journal.service';
import * as moment from 'moment';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDatepickerTimeHeaderComponent } from 'mat-datepicker-time-header';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { Router } from '@angular/router';
import { MatDatepicker } from '@angular/material/datepicker';

@Component({
  selector: 'app-mood',
  templateUrl: './mood.component.html',
  styleUrls: ['./mood.component.scss'],

  providers: [{ provide: MAT_DATE_FORMATS, useValue: DATE_FORMATS3 }],
})
export class MoodComponent implements OnInit {
  currentDate = moment();
  formGroup: FormGroup = new FormGroup({
    date: new FormControl(this.currentDate),
    time: new FormControl(this.currentDate.format('hh:mm')),
    note: new FormControl(),
  });
  maxDate = moment();
  timeHeader = MatDatepickerTimeHeaderComponent;
  isLoading;
  STEP = 1;
  selectedEmotion;
  activities: any[] = [];

  constructor(
    public moodJournalService: MoodJournalService,
    public authService: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.moodJournalService.getUserActivities().subscribe((a) => {
      this.activities = a.map((activity) => ({ ...activity, selected: false }));
    });

    this.formGroup.get('time').valueChanges.subscribe(() => {
      const date = this.formGroup.get('date').value.format('yyyy-MM-DD');
      const time = this.formGroup.get('time').value;
      const d = moment(date + ' ' + time, 'yyyy-MM-DD HH:mm');
      this.formGroup.get('date').setValue(d, { emitEvent: false });
    });

    this.formGroup.get('date').valueChanges.subscribe(() => {
      const date = this.formGroup.get('date').value.format('yyyy-MM-DD');
      const time1 = this.formGroup.get('date').value.format('HH:mm');
      const time = this.formGroup.get('time').value;
      if (time != time1) {
        const d = moment(date + ' ' + time, 'yyyy-MM-DD HH:mm');

        setTimeout(() => {
          this.formGroup.get('date').setValue(d, { emitEvent: true });
        });
      }
    });
  }

  save() {
    const moodToSave = {
      userId: this.authService.getAuthUser().id,
      date: this.formGroup.get('date').value.format(date_db_format),
      emotionId: this.selectedEmotion.id,
      note: this.formGroup.get('note').value,
      activities: this.activities.filter((a) => a.selected).map((a) => a.id),
    };
    this.moodJournalService.saveMood(moodToSave).subscribe((result) => {
      if (result != null) this.router.navigate(['/home']);
    });
  }
  selectMonth(dp: MatDatepicker<any>) {
    dp.close();
  }
}
