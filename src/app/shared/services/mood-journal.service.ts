import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as moment from 'moment';
import {
  ActivityDTO,
  EmotionDTO,
  Mood,
  MoodDTO,
  User,
  date_db_format,
  date_db_short_format,
  date_key_format,
  date_time_format,
} from '../model/mood-journal.model';

export const MoodsPageSize = 40;

@Injectable({
  providedIn: 'root',
})
export class MoodJournalService {
  private readonly MoodJournalServiceUrl = `http://localhost:3000`;

  public emotions: EmotionDTO[];
  public activities: ActivityDTO[];
  public moods: Mood[];
  public pageNumber: number;
  public emotionScore;
  public range;

  constructor(private http: HttpClient, public snackBar: MatSnackBar) {}

  clearStorage() {
    this.activities = null;
    this.moods = null;
    this.pageNumber = 0;
    this.range = null;
  }

  // login
  public login(username: string, password: string): Observable<User> {
    return this.http.post<User>(`${this.MoodJournalServiceUrl}/users/login`, {
      username,
      password,
    });
  }

  public register(username: string, password: string): Observable<User> {
    return this.http.post<User>(
      `${this.MoodJournalServiceUrl}/users/register`,
      {
        username,
        password,
      }
    );
  }

  // emotions
  public getEmotions(): Observable<EmotionDTO[]> {
    return this.emotions
      ? of(this.emotions)
      : this.http
          .get<EmotionDTO[]>(`${this.MoodJournalServiceUrl}/emotions/`)
          .pipe(
            tap((emotions) => {
              this.emotions = emotions.sort((a, b) => b.score - a.score);
              this.emotionScore = this.emotions.reduce((acc, obj) => {
                acc[obj.name] = obj.score;
                return acc;
              }, {});
            }),
            catchError(() => {
              this.showErrorMessage('The Mood Journal Server is down');
              return of([]);
            })
          );
  }

  //activities
  public getUserActivities(userId?: number): Observable<ActivityDTO[]> {
    const authUser = JSON.parse(localStorage.getItem('AuthUser')) as User;
    userId = userId || authUser?.id;
    return this.activities
      ? of(this.activities)
      : this.http
          .get<ActivityDTO[]>(
            `${this.MoodJournalServiceUrl}/activities/?userId=${userId}`
          )
          .pipe(
            tap((activities) => {
              this.activities = activities;
            })
          );
  }

  public addActivity(activity) {
    return this.http
      .post<ActivityDTO>(`${this.MoodJournalServiceUrl}/activities`, activity)
      .pipe(
        tap((act) => {
          this.activities.push(act);
        }),
        catchError(() => {
          this.showErrorMessage('Error saving activity');
          return of(null);
        })
      );
  }
  public removeActivity(activityId) {
    return this.http
      .delete<ActivityDTO>(
        `${this.MoodJournalServiceUrl}/activities/${activityId}`
      )
      .pipe(
        tap(() => {
          const idx = this.activities.indexOf((act) => act.id === activityId);
          this.activities.splice(idx, 1);
        }),
        catchError(() => {
          this.showErrorMessage(
            'This activity cannot be deleted because it is currently in use.'
          );
          return of('ERROR');
        })
      );
  }

  // moods
  public getUserRecentMoods(
    userId: number,
    pageNumber?: number,
    pageSize = MoodsPageSize
  ): Observable<Mood[]> {
    return (
      pageNumber && pageSize
        ? this.http.get<MoodDTO[]>(
            `${this.MoodJournalServiceUrl}/moods/?userId=${userId}&pageNumber=${pageNumber}&pageSize=${pageSize}`
          )
        : this.http.get<MoodDTO[]>(
            `${this.MoodJournalServiceUrl}/moods/?userId=${userId}`
          )
    ).pipe(
      map((moods) => moods.map((mood) => this.transformMoodDtoToMood(mood))),
      tap((moods) => {
        this.moods = this.moods ? this.moods.concat(moods) : moods;
        this.pageNumber = pageNumber;
      }),
      catchError(() => {
        this.showErrorMessage('The Mood Journal Server is down');
        return of([]);
      })
    );
  }

  public getMoodById(id): Observable<MoodDTO> {
    return this.http
      .get<MoodDTO>(`${this.MoodJournalServiceUrl}/moods/${id}`)
      .pipe(
        catchError(() => {
          this.showErrorMessage('The Mood Journal Server is down');
          return of(null);
        })
      );
  }

  public addMood(mood) {
    return this.http
      .post<MoodDTO>(`${this.MoodJournalServiceUrl}/moods`, mood)
      .pipe(
        tap(() => {
          this.moods = null;
          this.range = null;
          this.pageNumber = 0;
        }),
        catchError(() => {
          this.showErrorMessage('Error saving mood');
          return of(null);
        })
      );
  }

  public updateMood(mood) {
    return this.http
      .put<MoodDTO>(`${this.MoodJournalServiceUrl}/moods/${mood.id}`, mood)
      .pipe(
        tap(() => {
          this.moods = null;
          this.range = null;
          this.pageNumber = 0;
        }),
        catchError(() => {
          this.showErrorMessage('Error saving mood');
          return of(null);
        })
      );
  }

  public removeMood(mood) {
    return this.http
      .delete<MoodDTO>(`${this.MoodJournalServiceUrl}/moods/${mood.id}`)
      .pipe(
        tap(() => {
          this.moods.splice(this.moods.indexOf(mood), 1);
          this.range = null;
        }),
        catchError(() => {
          this.showErrorMessage('Error removing mood');
          return of('ERROR');
        })
      );
  }

  // charts
  public getChartActivitiesPerDay(
    startDate?: string,
    endDate?: string
  ): Observable<any[]> {
    const authUser = JSON.parse(localStorage.getItem('AuthUser')) as User;
    startDate =
      startDate ||
      moment().subtract(1, 'months').startOf('day').format(date_db_format);
    endDate = endDate || moment().endOf('day').format(date_db_format);
    return this.http
      .get<any[]>(
        `${this.MoodJournalServiceUrl}/charts/activitiesPerDay/${authUser.id}?startDate=${startDate}&endDate=${endDate}`
      )
      .pipe(
        tap((dates) => {
          const allDatesInRange = this.getAllPossibleDates(startDate, endDate);
          for (const date of allDatesInRange) {
            const existingData = dates.find((d) => d.date === date);
            if (!existingData) {
              dates.push({ date: date, count: 0 });
            }
          }
          dates.sort((a, b) => (a.date > b.date ? 1 : -1));
          return dates;
        }),
        catchError(() => {
          this.showErrorMessage('Error getting chart data');
          return of(null);
        })
      );
  }
  public getChartEmotionEvolution(
    startDate?: string,
    endDate?: string
  ): Observable<any[]> {
    const authUser = JSON.parse(localStorage.getItem('AuthUser')) as User;
    startDate =
      startDate ||
      moment().subtract(1, 'months').startOf('day').format(date_db_format);
    endDate = endDate || moment().endOf('day').format(date_db_format);
    return this.http
      .get<any[]>(
        `${this.MoodJournalServiceUrl}/charts/emotionEvolution/${authUser.id}?startDate=${startDate}&endDate=${endDate}`
      )
      .pipe(
        catchError(() => {
          this.showErrorMessage('Error getting chart data');
          return of(null);
        })
      );
  }
  public getChartYearInPixels(year?): Observable<any[]> {
    const authUser = JSON.parse(localStorage.getItem('AuthUser')) as User;
    year = year || moment().year();
    return this.http
      .get<any[]>(
        `${this.MoodJournalServiceUrl}/charts/yearInPixels/${authUser.id}?year=${year}`
      )
      .pipe(
        catchError(() => {
          this.showErrorMessage('Error getting chart data');
          return of(null);
        })
      );
  }
  public getMonthInPixels(year?, month?): Observable<any[]> {
    const authUser = JSON.parse(localStorage.getItem('AuthUser')) as User;
    year = year || moment().year();
    month = month || moment().month() + 1;
    return this.http
      .get<any[]>(
        `${this.MoodJournalServiceUrl}/charts/monthInPixels/${authUser.id}?year=${year}&month=${month}`
      )
      .pipe(
        catchError(() => {
          this.showErrorMessage('Error getting data');
          return of(null);
        })
      );
  }
  public getDateRange(): Observable<{
    minDate: string;
    maxDate: string;
  }> {
    const authUser = JSON.parse(localStorage.getItem('AuthUser')) as User;

    return this.range
      ? of(this.range)
      : this.http
          .get<any>(
            `${this.MoodJournalServiceUrl}/charts/dateRange/${authUser.id}`
          )
          .pipe(
            tap((range) => {
              this.range = range;
            }),
            catchError(() => {
              this.showErrorMessage('Error getting date range');
              return of(null);
            })
          );
  }

  public suggestedActivity(): Observable<number[]> {
    const authUser = JSON.parse(localStorage.getItem('AuthUser')) as User;

    return this.http
      .get<any>(
        `${this.MoodJournalServiceUrl}/charts/suggestedActivity/${authUser.id}`
      )
      .pipe(
        catchError(() => {
          this.showErrorMessage('Error getting suggested activity');
          return of([]);
        })
      );
  }

  // utiles
  private transformMoodDtoToMood(moodDto) {
    return {
      ...moodDto,
      date: moment(moodDto.date, date_db_format).format(date_key_format),
      time: moment(moodDto.date, date_db_format).format(date_time_format),
      emotion: this.emotions.find((e) => e.id == moodDto.emotionId),
      activities: moodDto.activities
        .map((activityId) => this.activities.find((a) => a.id == activityId))
        .filter((a) => a),
    };
  }

  private showErrorMessage(message: string, ...params): void {
    this.snackBar.open(message, 'Close', {
      duration: 0,
      panelClass: ['error-snackbar'],
    });
  }

  public calculateAvgMood(moods) {
    if (!moods?.length) return '';

    const sum = moods.reduce((sum, mood) => {
      sum += this.emotionScore[mood.emotion.name];
      return sum;
    }, 0);

    const avg: number = Math.round(sum / moods.length);
    return Object.keys(this.emotionScore).find(
      (key) => this.emotionScore[key] === avg
    );
  }

  getAllPossibleDates(start: string, end: string): string[] {
    const allDates: string[] = [];
    let currentDate = moment(start, date_db_format);
    const endDate = moment(end, date_db_format);

    // Iterează prin fiecare zi din intervalul specificat și adaugă data în array
    while (currentDate <= endDate) {
      allDates.push(currentDate.format('yyyy-MM-DD'));
      currentDate = currentDate.add(1, 'day');
    }
    return allDates;
  }
}
