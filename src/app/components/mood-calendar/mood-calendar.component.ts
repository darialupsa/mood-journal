import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatCalendar, MatDatepicker } from '@angular/material/datepicker';

import * as moment from 'moment';
import { forkJoin } from 'rxjs';
import {
  EMOTIONS,
  date_db_format,
} from 'src/app/shared/model/mood-journal.model';
import { MoodJournalService } from 'src/app/shared/services/mood-journal.service';

@Component({
  selector: 'app-mood-calendar',
  templateUrl: './mood-calendar.component.html',
  styleUrls: ['./mood-calendar.component.scss'],
})
export class MoodCalendarComponent implements OnInit, OnChanges {
  @Input() date = moment();
  @Input() minSelectableDate;
  @Output() selectDate = new EventEmitter<{ date: moment.Moment }>();

  @ViewChild('datepicker') datepicker: MatDatepicker<any>;

  constructor(private moodJournalService: MoodJournalService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['date']) {
      this.dateFormControl.setValue(this.date, { emitEvent: false });
    }
  }

  minDate = null;
  maxDate = moment();
  dateFormControl = new FormControl(moment());
  dates = {};
  month;
  year;
  currentView = 'month';

  dateFilter = (date: moment.Moment) => {
    return true;
  };
  dateClass =
    () =>
    (date: moment.Moment): any => {
      return '';
    };

  ngOnInit(): void {
    this.dateFormControl.valueChanges.subscribe((value) => {
      this.selectDate.emit(value);
    });
  }

  ngAfterViewInit() {
    this.datepicker.openedStream.subscribe(() => {
      this.currentView = 'month';
      const date = this.dateFormControl.value;
      this.month = date.month() + 1;
      this.year = date.year();
      this.attachClickEventsToCalendarNavigation();
      this.loadData();
    });

    this.datepicker.monthSelected.subscribe((date: moment.Moment) => {
      this.month = date.month() + 1;
      this.year = date.year();
      this.loadData();
    });
  }
  attachClickEventsToCalendarNavigation() {
    setTimeout(() => {
      const calendarHeader = document.querySelector('.mat-calendar-header');

      if (calendarHeader) {
        const prevButton = calendarHeader.querySelector(
          '.mat-calendar-previous-button'
        );
        const nextButton = calendarHeader.querySelector(
          '.mat-calendar-next-button'
        );

        if (prevButton) {
          prevButton.removeEventListener(
            'click',
            this.handlePrevButtonClick.bind(this)
          );
          prevButton.addEventListener(
            'click',
            this.handlePrevButtonClick.bind(this)
          );
        }
        if (nextButton) {
          nextButton.removeEventListener(
            'click',
            this.handleNextButtonClick.bind(this)
          );
          nextButton.addEventListener(
            'click',
            this.handleNextButtonClick.bind(this)
          );
        }
      }
    });
  }

  handlePrevButtonClick() {
    this.handleCalendarNavigation('previous');
  }
  handleNextButtonClick() {
    this.handleCalendarNavigation('next');
  }

  handleCalendarNavigation(direction: 'previous' | 'next') {
    this.month = direction == 'previous' ? this.month - 1 : this.month + 1;
    if (this.month == 0) {
      this.month = 12;
      this.year--;
    } else if (this.month == 13) {
      this.month = 1;
      this.year++;
    }
    this.loadData();
  }

  loadData() {
    forkJoin(
      this.moodJournalService.getMonthInPixels(this.year, this.month),
      this.moodJournalService.getDateRange()
    ).subscribe(([data, range]) => {
      this.minDate = moment(range.minDate, date_db_format);

      this.dates = data.reduce((acc, obj) => {
        acc[obj.date] = obj.score;
        return acc;
      }, {});

      this.refresh();
    });
  }

  onViewChanged(val) {
    this.currentView = val;
    this.refresh();
  }

  refresh() {
    setTimeout(() => {
      this.dateFilter = ((date: moment.Moment) => {
        if (!date) {
          return false;
        }
        return this.currentView == 'month'
          ? this.dates[date.format('yyyy-MM-DD')] &&
              (!this.minSelectableDate ||
                date.isSameOrAfter(this.minSelectableDate))
          : true;
      }).bind(this);

      setTimeout(() => {
        this.dateFilter = ((date: moment.Moment) => {
          if (!date) {
            return false;
          }
          return this.currentView == 'month'
            ? this.dates[date.format('yyyy-MM-DD')] &&
                (!this.minSelectableDate ||
                  date.isSameOrAfter(this.minSelectableDate))
            : true;
        }).bind(this);

        this.dateClass = (() =>
          (date: moment.Moment): any => {
            if (!date || this.currentView != 'month') {
              return '';
            }
            const score = this.dates[date.format('yyyy-MM-DD')];
            return score ? EMOTIONS[score]?.name : '';
          }).bind(this);
      }, 0);
    }, 0);
  }
}
