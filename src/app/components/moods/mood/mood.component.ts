import { Component, OnInit, ViewChild } from '@angular/core';

import {
  ActivityDTO,
  DATE_FORMATS3,
  MoodDTO,
  date_db_format,
} from 'src/app/shared/model/mood-journal.model';
import { MoodJournalService } from 'src/app/shared/services/mood-journal.service';
import * as moment from 'moment';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDatepickerTimeHeaderComponent } from 'mat-datepicker-time-header';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDatepicker } from '@angular/material/datepicker';
import { forkJoin, takeUntil } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { AddActivityDialogComponent } from '../add-activity-dialog/add-activity-dialog.component';
import { MatMenuTrigger } from '@angular/material/menu';

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
  emotions;
  moodId = null;
  activityToRemove;

  constructor(
    public moodJournalService: MoodJournalService,
    public authService: AuthenticationService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    forkJoin(
      this.moodJournalService.getEmotions(),
      this.moodJournalService.getUserActivities()
    ).subscribe(([emotions, activities]) => {
      this.emotions = emotions;
      this.activities = activities.map((activity) => ({
        ...activity,
        selected: false,
      }));

      this.moodId = this.route.snapshot.params['id'];
      if (this.moodId) {
        this.moodJournalService
          .getMoodById(this.moodId)
          .subscribe((mood: MoodDTO) => {
            this.formGroup.patchValue({
              date: moment(mood.date, date_db_format),
              time: moment(mood.date, date_db_format).format('HH:mm'),
              note: mood.note,
            });
            this.selectedEmotion = this.emotions.find(
              (e) => e.id == mood.emotionId
            );
            this.activities.forEach((a) => {
              a.selected = mood.activities.includes(a.id);
            });
          });
      }
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

    if (this.moodId) {
      this.moodJournalService
        .updateMood({ ...moodToSave, id: this.moodId })
        .subscribe((result) => {
          if (result != null) this.router.navigate(['/home']);
        });
    } else {
      this.moodJournalService.addMood(moodToSave).subscribe((result) => {
        if (result != null) this.router.navigate(['/home']);
      });
    }
  }
  selectMonth(dp: MatDatepicker<any>) {
    dp.close();
  }

  addActivity() {
    const dialogRef = this.dialog.open(AddActivityDialogComponent, {
      width: '350px',
    });
    dialogRef.afterClosed().subscribe((activity) => {
      if (activity) {
        this.moodJournalService
          .addActivity({
            ...activity,
            userId: this.authService.getAuthUser().id,
          })
          .subscribe((result) => {
            if (result) {
              this.activities.push({ ...result, selected: false });
            }
          });
      }
    });
  }

  removeActivity() {
    this.moodJournalService
      .removeActivity(this.activityToRemove.id)
      .subscribe((result) => {
        if (result != 'ERROR') {
          this.activities.splice(
            this.activities.indexOf(this.activityToRemove),
            1
          );
        }
      });
  }

  handleClick(event: MouseEvent, activity): void {
    if (event.button === 2) {
      console.log('Right-click detected');
      event.preventDefault();
      event.stopPropagation();
      this.activityToRemove = activity;
      //this.contextMenu.openMenu();
    } else {
      event.preventDefault();
      event.stopPropagation();
    }
  }
}
