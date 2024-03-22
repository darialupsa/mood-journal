import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { forkJoin, of, tap } from 'rxjs';
import { Anim1, Anim2 } from 'src/animations';
import {
  DATE_FORMATS2,
  Mood,
  User,
  date_display_shortdate_format,
  date_key_format,
} from 'src/app/shared/model/mood-journal.model';
import {
  MoodJournalService,
  MoodsPageSize,
} from 'src/app/shared/services/mood-journal.service';
import * as moment from 'moment';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { FormControl } from '@angular/forms';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';

@Component({
  selector: 'app-moods',
  templateUrl: './moods.component.html',
  styleUrls: ['./moods.component.scss'],
  animations: [Anim1, Anim2],

  providers: [{ provide: MAT_DATE_FORMATS, useValue: DATE_FORMATS2 }],
})
export class MoodsComponent implements OnInit, AfterViewInit {
  constructor(
    private moodJournalService: MoodJournalService,
    private authService: AuthenticationService
  ) {}

  @ViewChild('wrapper') wrapperRef: ElementRef;

  dateMoods = {};
  groups = [];
  date: moment.Moment;
  stopFlag: boolean;
  authUser;
  pageNumber = 1;
  finised: boolean;
  minDate = null;
  maxDate = moment();
  isLoading = false;
  monthInPixels = {};

  ngOnInit(): void {
    this.authUser = this.authService.getAuthUser();

    this.isLoading = true;
    forkJoin(
      this.moodJournalService.getEmotions(),
      this.moodJournalService.getUserActivities(this.authUser.id)
    ).subscribe(() => {
      this.loadMoods(true);
    });
  }

  loadMoods(init?: boolean) {
    if (this.finised) return;

    this.isLoading = true;

    (init && this.moodJournalService.moods
      ? of(this.moodJournalService.moods).pipe(
          tap((moods: Mood[]) => {
            this.pageNumber = this.moodJournalService.pageNumber + 1;
            this.finised = moods.length % MoodsPageSize > 0;
          })
        )
      : this.moodJournalService
          .getUserRecentMoods(this.authUser.id, this.pageNumber++)
          .pipe(
            tap((moods: Mood[]) => {
              this.finised = moods.length < MoodsPageSize;
            })
          )
    ).subscribe((moods: Mood[]) => {
      this.dateMoods = moods.reduce((acc, obj) => {
        if (acc[obj.date]) {
          acc[obj.date].push(obj);
        } else {
          acc[obj.date] = [obj];
        }
        return acc;
      }, this.dateMoods);

      this.groups = Object.keys(this.dateMoods).map((key) => ({
        date: key,
        weekDay: this.getWeekDay(key),
        shortDate: moment(key, date_key_format).format(
          date_display_shortdate_format
        ),
        moods: this.dateMoods[key],
      }));

      this.isLoading = false;

      this.minDate = this.groups.length
        ? moment(this.groups[this.groups.length - 1].date, date_key_format)
        : moment();

      if (init) {
        this.date = this.groups.length
          ? moment(this.groups[0].date, date_key_format)
          : moment();
      }
    });
  }

  ngAfterViewInit(): void {
    this.wrapperRef.nativeElement.addEventListener(
      'scroll',
      this.handleScroll.bind(this)
    );
  }

  getWeekDay(date) {
    const today = moment().format(date_key_format);
    const yesterday = moment().add(-1, 'day').format(date_key_format);

    return date === today
      ? 'Today'
      : date === yesterday
      ? 'Yesterday'
      : moment(date, date_key_format).format('dddd');
  }

  handleScroll(event: Event) {
    if (this.stopFlag) return;

    const wrapper = this.wrapperRef.nativeElement;
    const topVisible = Array.from(wrapper.children[0].children).find((child) =>
      this.isTopVisibleGroup(child as HTMLElement)
    );

    if (topVisible) {
      const index = Array.prototype.indexOf.call(
        wrapper.children[0].children,
        topVisible
      );

      this.date = moment(this.groups[index].date, date_key_format);
    }
  }

  isTopVisibleGroup(groupElement: HTMLElement): boolean {
    const visibleChild = Array.from(groupElement.children).find(
      (child) => child.getBoundingClientRect().top > 170
    );
    return !!visibleChild;
  }

  scrollTo(date) {
    const groupIndex = this.groups.findIndex(
      (group) => group.date === date.format(date_key_format)
    );
    if (groupIndex >= 0) {
      this.stopFlag = true;
      const groupElem: HTMLElement =
        this.wrapperRef.nativeElement.children[0].children[groupIndex];

      setTimeout(() => {
        groupElem?.scrollIntoView({ block: 'start', behavior: 'smooth' });
      }, 0);

      setTimeout(() => {
        this.stopFlag = false;
      }, 1000);
    }
  }

  removeMood(group, mood) {
    this.moodJournalService.removeMood(mood).subscribe((result) => {
      if (result != 'ERROR') {
        group.moods.splice(group.moods.indexOf(mood), 1);
        if (!group.moods.length) {
          this.groups.splice(this.groups.indexOf(group), 1);
          delete this.dateMoods[group.date];
        }
      }
    });
  }
}
